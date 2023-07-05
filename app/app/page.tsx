"use client";
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { PlantCard, PlantCardModal } from "../components/index";
import { useAppContext } from "../lib/appContext";
import Link from "next/link";
import { API, Auth } from "aws-amplify";
import { onError } from "../lib/error";
import {
  Collection,
  Room,
  Plant,
  FilterItem,
  NewRoomData,
  NewPlantData,
} from "../types";
import CollectionModal from "../components/collections/collectionModal";
import PlusButton from "../components/buttons/plusButton";
import DropdownCheckbox from "../components/inputs/dropdownCheckbox";
import * as uuid from "uuid";

const Home: NextPage = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const { isAuthenticated, login, logout } = useAppContext();
  const [data, setData] = useState<Collection[]>([] as Collection[]);
  const [plants, setPlants] = useState<Plant[]>([] as Plant[]);
  const [expandCards, setExpandCards] = useState(false);
  const [collectionModalEnabled, setCollectionModalEnabled] = useState(false);
  const [roomModalEnabled, setRoomModalEnabled] = useState(false);
  const [plantModalEnabled, setPlantModalEnabled] = useState(false);
  const [focusedCollectionId, setFocusedCollectionId] = useState("");
  const [focusedRoomId, setFocusedRoomId] = useState("");
  const [collectionFilter, setCollectionFilter] = useState([] as FilterItem[]);
  const [roomFilter, setRoomFilter] = useState([] as FilterItem[]);

  const addNewPlant = async (newPlant: NewPlantData) => {
    const plantData = {
      id: newPlant.id,
      sciName: newPlant.sciName,
      nickname: newPlant.nickname,
      commonName: newPlant.commonName,
      instructions: newPlant.instructions,
      attachment: newPlant.attachment,
    };
    let collection: Collection | undefined = data.find(
      (collection) => collection?.id === newPlant.collectionId
    );
    if (!collection) {
      if (!newPlant.roomName || !newPlant.collectionName) {
        throw new Error(`Could not create collection`);
      }
      const newCollection: Omit<Collection, "createdAt"> = {
        name: newPlant.collectionName,
        rooms: [
          {
            name: newPlant.roomName,
            lighting: {
              direction: newPlant.roomLightingDirection!,
              intensity: newPlant.roomLightingIntensity!,
            },
            plants: [plantData],
          },
        ],
      };
      return await createCollection(newCollection);
    }
    const plantRoom =
      collection.rooms?.find((room) => room?.id === newPlant.roomId) ??
      ({
        id: uuid.v4(),
        name: newPlant.roomName,
        lighting: {
          direction: newPlant.roomLightingDirection,
          intensity: newPlant.roomLightingIntensity,
        },
        plants: [plantData],
      } as Room);
    console.log(plantRoom);
    collection.rooms =
      collection.rooms.length > 0
        ? collection.rooms?.map((room) => {
            if (room.id === plantRoom.id) {
              return plantRoom;
            }
            return room;
          })
        : [plantRoom];
    console.log(collection);
    await updateCollection(collection);
    closePlantModal();
  };
  const deletePlant = async (plantId: string) => {
    console.log(plants);
    const plant = plants.find((plant) => plant?.id === plantId);
    console.log(plant);
    const collection = data.find(
      (collection) => collection?.id === plant?.collectionId
    );
    console.log(collection);
    const roomToRemove =
      collection?.rooms?.find((room) => room?.id === plant?.roomId)?.id ?? "";
    collection!.rooms =
      collection?.rooms.filter((room) => room?.id !== roomToRemove) ?? [];
    await updateCollection(collection!);
  };
  const addNewRoomWithPlants = async (newRoomData: NewRoomData) => {
    const collection = data.find(
      (collection) => collection.id === newRoomData.collectionId
    );
    if (!collection) {
      throw new Error(
        `Could not find collection for id ${newRoomData.collectionId}`
      );
    }
    const newRoom: Room = {
      id: uuid.v4(),
      name: newRoomData.name,
      lighting: newRoomData.lighting,
      plants: newRoomData.plants,
    };
    if (!collection?.rooms) {
      collection.rooms = [newRoom];
    } else {
      collection?.rooms?.push(newRoom);
    }
    await updateCollection(collection);
    closeRoomModal();
  };

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      const session = await Auth.currentSession();
      login();
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setData([]);
    }
  }, [isAuthenticated]);

  const initializeFilters = () => {
    const collectionFilters = getCollectionFilterItems();
    const roomFilters = getRoomFilterItems();
    setCollectionFilter(collectionFilters);
    setRoomFilter(roomFilters);
  };
  useEffect(() => {
    if (isLoading) return;
    closeAllModals();
    initializeFilters();
    const plants = flattenDataToPlants(data);
    setPlants(plants);
  }, [data, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    console.log("collections updated");
    const filteredCollections = data.filter((collection) =>
      collectionFilter
        .map((collection) => collection.id)
        .includes(collection.id!)
    );
    const plants = flattenDataToPlants(filteredCollections);
    const filteredPlants = plants.filter((plant) =>
      roomFilter.map((room) => room.id).includes(plant.roomId!)
    );

    setPlants(filteredPlants);
  }, [collectionFilter, roomFilter, isLoading]);

  const showCollectionModal = () => {
    setPlantModalEnabled(false);
    setRoomModalEnabled(false);
    setCollectionModalEnabled(true);
  };

  const showRoomModal = (collectionId: string) => {
    setCollectionModalEnabled(false);
    setPlantModalEnabled(false);
    setRoomModalEnabled(true);
    setFocusedCollectionId(collectionId);
  };

  const showPlantModal = () => {
    setCollectionModalEnabled(false);
    setRoomModalEnabled(false);
    setPlantModalEnabled(true);
  };
  const closeAllModals = () => {
    setCollectionModalEnabled(false);
    setRoomModalEnabled(false);
    setPlantModalEnabled(false);
  };
  const closeCollectionModal = () => {
    setCollectionModalEnabled(false);
  };

  const closeRoomModal = () => {
    setRoomModalEnabled(false);
  };

  const closePlantModal = () => {
    setPlantModalEnabled(false);
  };

  const handleLogout = async () => {
    await Auth.signOut();
    logout();
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const collections = await API.get("Sepal", "/collections", {});
      console.log(collections.Items);
      if (collections.Items?.length > 0) {
        setData(collections.Items);
      }
    } catch (error) {
      onError(error as Error);
    }
    setIsLoading(false);
  };

  const createCollection = async (body: Omit<Collection, "createdAt">) => {
    body.rooms = body.rooms.map((room) => ({
      ...room,
      id: uuid.v4(),
    }));
    try {
      const response = await API.post("Sepal", "/collections", {
        body,
      });
      setData([...data, response]);
    } catch (e) {
      onError(e as Error);
    }
  };
  function getCollectionFilterItems() {
    return data.map((collection) => ({
      id: collection.id!,
      name: collection.name,
    }));
  }

  function getRoomFilterItems() {
    return data
      .map((collection) => collection.rooms)
      .reduce((a, b) => [...a, ...b], [])
      .map((room) => ({ id: room.id!, name: room.name }));
  }
  const updateCollection = async (body: Collection) => {
    try {
      await API.put("Sepal", `/collections/${body.id}`, {
        body,
      });
      const newData = data.map((collection) => {
        if (collection.id === body.id) {
          return body;
        }
        return collection;
      });
      setData(newData);
    } catch (e) {
      onError(e as Error);
    }
  };
  function flattenDataToPlants(data: Collection[]) {
    return data
      .map((collection) =>
        flatten(collection.rooms, { collectionId: collection.id! })
      )
      .reduce((a, b) => [...a, ...b], [])
      .map((room) =>
        flatten(room.plants, {
          collectionId: room.collectionId,
          roomId: room.id,
        })
      )
      .reduce((a, b) => [...a, ...b], []);
  }

  function flatten<T extends Object>(
    array: T[],
    vals: Record<string, any>
  ): (T & Record<string, any>)[] {
    return array.map((elem) => Object.assign(elem, vals));
  }
  const renderPlants = () => {
    return plants?.map((plant) => {
      return (
        <PlantCard
          key={plant.id}
          collection={data.find(
            (collection) => collection.id === plant.collectionId
          )}
          room={data
            .find((collection) => collection.id === plant.collectionId)
            ?.rooms.find((room) => room.id === plant.roomId)}
          plantId={plant.id}
          id={`${plant.id}-card`}
          isExpanded={expandCards}
          nickname={plant.nickname}
          sciName={plant.sciName}
          commonName={plant.commonName}
          instructions={plant.instructions}
          showCardModal={showRoomModal}
          onClick={setExpandCards}
          handleDelete={deletePlant}
          attachment={plant.attachment}
        />
      );
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SEPAL</title>
        <meta name="description" content="honor your roots" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <div className="max-w-screen-xl flex flex-wrap items-bottom justify-between mx-auto p-4">
          <span className={styles.title}>
            <i>S E P A L</i>
          </span>
          <p className={styles.description}>Honor your roots</p>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0">
              {isAuthenticated ? (
                <li>
                  <button className={styles.button} onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <div className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ">
                      <Link href="/signup">Sign Up</Link>
                    </div>
                  </li>
                  <li>
                    <div className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ">
                      <Link href="/login">Login</Link>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {!isAuthenticating && (
        <main className={styles.main}>
          {collectionModalEnabled && (
            <CollectionModal
              cancel={closeCollectionModal}
              handleSubmit={createCollection}
            />
          )}
          {plantModalEnabled && (
            <PlantCardModal
              cancel={closePlantModal}
              handleSubmit={addNewPlant}
              collections={data}
            />
          )}
          {!plantModalEnabled && !isLoading && (
            <div id="plant-grid">
              <div className="flex flex-wrap">
                <DropdownCheckbox
                  name="Collections"
                  items={getCollectionFilterItems()}
                  onChange={(list) =>
                    setCollectionFilter(
                      list.map((item) => ({ id: item.id, name: item.name }))
                    )
                  }
                />
                <DropdownCheckbox
                  name="Rooms"
                  items={getRoomFilterItems()}
                  onChange={(list) =>
                    setRoomFilter(
                      list.map((item) => ({ id: item.id, name: item.name }))
                    )
                  }
                />
              </div>
              <div id="plant-cards" className="grid grid-cols-1 gap 2">
                {renderPlants()}
              </div>
            </div>
          )}
          {!plantModalEnabled && <PlusButton handleClick={showPlantModal} />}
        </main>
      )}
      <footer className={styles.footer}>
        <a href="https://eric.gt" target="_blank" rel="noopener noreferrer">
          Created by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Eric GT" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
