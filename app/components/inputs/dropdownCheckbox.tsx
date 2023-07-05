import { ChangeEvent, useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
type DropdownCheckBoxProps = {
  name: string;
  onChange: (selected: Array<{ id: string; name: string }>) => void;
  items: Array<{
    id: string;
    name: string;
  }>;
};
export default function DropdownCheckbox(props: DropdownCheckBoxProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState(
    [] as Array<{ id: string; name: string }>
  );

  useEffect(() => {
    console.log(props.items);
    setCheckedItems(props.items);
    setIsLoading(false);
  }, []);

  function handleCheckChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const newSet = [
        ...checkedItems,
        props.items.find((item) => item.id === e.target.name)!,
      ];
      setCheckedItems(newSet);
    } else {
      const newSet = checkedItems.filter((item) => item.id !== e.target.value);
      setCheckedItems(newSet);
    }
  }

  useEffect(() => {
    if (isLoading) return;
    props.onChange(checkedItems);
  }, [checkedItems, isLoading]);
  const renderCheckboxes = () => {
    let index = 0;
    return props.items.map((item) => (
      <li key={++index}>
        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
          <input
            id={`checkbox-item-${props.name}-${item.name}`}
            name={item.id}
            type="checkbox"
            onChange={handleCheckChange}
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            htmlFor={`checkbox-item-${props.name}-${item.name}`}
            className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
          >
            {item.name}
          </label>
        </div>
      </li>
    ));
  };
  return (
    <div className="mr-5">
      <Dropdown label={`${props.name}`}>{renderCheckboxes()}</Dropdown>
    </div>
  );
  //   return (
  //     <div className="mr-2">
  //       <button
  //         id={`dropdownSearchButton-${props.name}`}
  //         data-dropdown-toggle={`dropdownSearch-${props.name}`}
  //         className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  //         type="button"
  //       >
  //         {props.name}
  //         <svg
  //           className="w-2.5 h-2.5 ml-2.5"
  //           aria-hidden="true"
  //           xmlns="http://www.w3.org/2000/svg"
  //           fill="none"
  //           viewBox="0 0 10 6"
  //         >
  //           <path
  //             stroke="currentColor"
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth="2"
  //             d="m1 1 4 4 4-4"
  //           />
  //         </svg>
  //       </button>

  //       <div
  //         id={`dropdownSearch-${props.name}`}
  //         className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700"
  //       >
  //         <div className="p-3">
  //           <label
  //             htmlFor={`input-group-search-${props.name}`}
  //             className="sr-only"
  //           >
  //             Search
  //           </label>
  //           <div className="relative">
  //             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
  //               <svg
  //                 className="w-4 h-4 text-gray-500 dark:text-gray-400"
  //                 aria-hidden="true"
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 fill="none"
  //                 viewBox="0 0 20 20"
  //               >
  //                 <path
  //                   stroke="currentColor"
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth="2"
  //                   d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
  //                 />
  //               </svg>
  //             </div>
  //             <input
  //               type="text"
  //               id={`input-group-search-${props.name}`}
  //               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  //               placeholder="Search user"
  //             />
  //           </div>
  //         </div>
  //         <ul
  //           className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
  //           aria-labelledby={`dropdownSearchButton-${props.name}`}
  //         >
  //           {renderCheckboxes()}
  //         </ul>
  //         <a
  //           href="#"
  //           className="flex items-center p-3 text-sm font-medium text-red-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-500 hover:underline"
  //         >
  //           <svg
  //             className="w-4 h-4 mr-2"
  //             aria-hidden="true"
  //             xmlns="http://www.w3.org/2000/svg"
  //             fill="currentColor"
  //             viewBox="0 0 20 18"
  //           >
  //             <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
  //           </svg>
  //           Delete user
  //         </a>
  //       </div>
  //     </div>
  //   );
}
