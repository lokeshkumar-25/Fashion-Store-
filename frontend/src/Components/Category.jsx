import React from "react";

const categories = [
  { name: "Men", description: "Mens clothing and accessories" },
  { name: "Women", description: "Womens clothing and accessories" },
  { name: "Kids", description: "Kids clothing and accessories" },
];
export default function Category({ onCategorySelected }) {
  return (
    <>
      <section>
        <h2
          className="text-2xl font-bold ml-4 my-10
                     sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl
                      md:ml-6 xl:ml-10 lg:ml-10 "
        >
          Shop By Category
        </h2>

        <div
          className="mb-10 mx-20 grid grid-cols-1 md:grid-cols-3 gap-4 cursor-pointe
                         "
        >
          {categories.map((Category) => {
            return (
              <button
                className=" gap-4 p-2 hover:bg-black/30 rounded-2xl cursor-pointer"
                key={Category.name}
                onClick={() => onCategorySelected(Category.name)}
              >
                <h3 className="text-xl font-semibold">{Category.name}</h3>
                <p className="text-gray-600 flex ">{Category.description}</p>
                <span className="mt-2 text-sm font-medium">
                  shop{Category.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
