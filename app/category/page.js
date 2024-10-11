"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  async function fetchCategory() {
    const data = await fetch(`${APIBASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      category.id = category._id;
      return category;
    });
    setCategoryList(c2);
  }

  const startEdit = (category) => async () => {
    setEditMode(true);
    reset(category);
  }

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    await fetch(`${APIBASE}/category/${id}`, {
      method: "DELETE",
    });
    fetchCategory();
  }


  useEffect(() => {
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit(data) {
    if (editMode) {
      // data.id = data._id
      fetch(`${APIBASE}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        reset({ name: '', order: '' })
        setEditMode(false)
        fetchCategory()
      });
      return
    }

    fetch(`${APIBASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      reset({ name: '', order: '' })
      setEditMode(false)
      fetchCategory()
    });
  }

  return (
    <main>
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64 ">

          <form onSubmit={handleSubmit(handleCategoryFormSubmit)}>
            <div className="grid grid-cols-2 gap-4 m-4 w-fit">
              <div>Category:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Order:</div>
              <div>
                <input
                  name="order"
                  type="number"
                  {...register("order", { required: true, defaultValue: 0 })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="col-span-2 text-right">
                {editMode ?
                  <input
                    type="submit"
                    value="Update"
                    className="px-4 py-2 font-bold text-white bg-blue-800 rounded-full hover:bg-blue-700"
                  />

                  :
                  <input
                    type="submit"
                    value="Add"
                    className="px-4 py-2 font-bold text-white bg-green-800 rounded-full hover:bg-green-700"
                  />
                }
                {
                  editMode &&
                  <button
                    onClick={() => {
                      reset({ name: '', order: '' })
                      setEditMode(false)
                    }}
                    className="px-4 py-2 ml-2 font-bold text-white bg-gray-800 rounded-full hover:bg-gray-700"
                  >Cancel</button>
                }
              </div>
            </div>
          </form>
        </div>
        <div className="flex-1 w-64 m-4 border bg-slate-300">


          <ul>
            {categoryList.map((c) =>
              <li key={c._id}>
                <button className="border border-black p-1/2" onClick={startEdit(c)}>📝</button>{' '}
                <button className="border border-black p-1/2" onClick={deleteById(c._id)}>❌</button>{' '}
                <Link href={`/category/${c._id}`}>{c.name}</Link> [{c.order}]
              </li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
