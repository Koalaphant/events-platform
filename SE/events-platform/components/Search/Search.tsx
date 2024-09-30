"use client";

import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function Search() {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = (e.target as HTMLFormElement).searchInput.value;
    console.log(e.target);
    console.log("Searching for:", query);
  };

  return (
    <div className="bg-slate-800 p-4 h-[400px] flex flex-col justify-center items-center mt-10">
      <form
        className="flex gap-2 justify-center items-center"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          name="searchInput"
          placeholder="Search"
          className="bg-slate-700 text-white p-2 rounded-md text-3xl"
          aria-label="Search input"
        />
        <button type="submit" className=" p-2">
          <FaMagnifyingGlass
            className="text-white text-3xl"
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
}
