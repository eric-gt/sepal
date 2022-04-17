import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
  PlantCard,
  PlantCardModal
} from '../components/index'


const Home: NextPage = (props: any) => {
  const [data, setData] = useState([{
    id: "diningmonst001",
    alert: false,
    thumb: "/monstera.webp",
    sciName: "Monstera Deliciosa",
    nickname: "Frankenstein's Monstera",
    room: "Dining Room",
    instructions: {
     water: "Flood & Drain every 2 weeks. Mist leaves 2x weekly",
     light: "Indirect"
    }
  }]);
  const [expandCards, setExpandCards] = useState(false);
  const [addNewPlantCard, setAddNewPlantCard] = useState(false);

  const addNewPlant = (newPlant) => {
    setData([...data, newPlant])
    // return () TODO: ADD MODAL FORM
  };

  useEffect(() => {
    closePlantCardModal()
  }, [data])
  const showCardModal = () => {
    setAddNewPlantCard(true);
  }
  const closePlantCardModal = () => {
    setAddNewPlantCard(false);
  }

  const renderPlantCards = () => {
   const plantCards= data.map(plant => {
      return (
      <PlantCard
            key={plant.id}
            expanded={expandCards}
            id={`${plant.id}-card`}
            alert={plant.alert}
            thumb={plant.thumb}
            sciName= {plant.sciName}
            nickname= {plant.nickname}
            room={plant.room}
            instructions = {plant.instructions}
      />
    )})
    return plantCards;
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>SEPAL</title>
        <meta name="description" content="honor your roots" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <i>S E P A L</i>
        </h1>

        <p className={styles.description}>
         Honor your roots
        </p>
        {addNewPlantCard && <PlantCardModal
          cancel={closePlantCardModal}
          handleSubmit={addNewPlant}
          rooms={["Dining Room", "Living Room", "Sun Room", "Kitchen"]}
        />}
        {!addNewPlantCard && <div id="plant-cards" className="grid grid-cols-1 gap 2">
            {renderPlantCards()}
        </div>}
        {!addNewPlantCard && <button onClick={showCardModal} className="ease-in duration-150 w-80 md:w-screen max-w-screen-sm min-h-fit bg-slate-500 hover:bg-slate-400 rounded-lg ">
          <p className="text-white text-base md:text-lg font-semibold">+</p>
        </button>}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://eric.gt"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Eric GT" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
