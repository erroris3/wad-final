"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const startEdit = (customer) => async () => {
    setEditMode(true);
    reset(customer);
  };

  async function fetchCustomers() {
    const data = await fetch(`${APIBASE}/customer`);
    const p = await data.json();
    const p2 = p.map((customer) => {
      customer.id = customer._id;
      return customer;
    });
    setCustomers(p2);
  }


  const createCustomerOrUpdate = async (data) => {
    if (editMode) {
      const response = await fetch(`${APIBASE}/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert(`Failed to update customer: ${response.status}`);
      }
      alert("Customer updated successfully");

      reset({
        name: "",
        dof: "",
        memberid: "",
        interests: "",
      });
      setEditMode(false);
      fetchCustomers();
      return;
    }

    const response = await fetch(`${APIBASE}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    try {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      // const json = await response.json();
      alert("Customer added successfully");

      reset({
        name: "",
        dof: "",
        memberid: "",
        interests: "",
      });
      fetchCustomers();
    } catch (error) {
      alert(`Failed to add customer: ${error.message}`);
      console.error(error);
    }
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    const response = await fetch(`${APIBASE}/customer/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert(`Failed to delete customer: ${response.status}`);
    }
    alert("Customer deleted successfully");
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64 ">
          <form onSubmit={handleSubmit(createCustomerOrUpdate)}>
            <div className="grid w-1/2 grid-cols-2 gap-4 m-4">
              <div>Name:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="w-full border border-black"
                />
              </div>
              <div>Date of birth:</div>
              <div>
                <input
                  name="dof"
                  type="date"
                  {...register("dof", { required: true })}
                  className="w-full border border-black"
                />
              </div>
              <div>Member Number:</div>
              <div>
                <input
                  name="memberid"
                  type="number"
                  {...register("memberid", { required: true })}
                  className="w-full border border-black"
                />
              </div>

              <div>Interests:</div>
              <div>
                <textarea
                  name="interest"
                  {...register("interests", { required: false })}
                  className="w-full border border-black"
                />
              </div>
              <div className="col-span-2">
                {editMode ? (
                  <input
                    type="submit"
                    value="Update"
                    className="px-4 py-2 font-bold text-white bg-blue-800 rounded-full hover:bg-blue-700"
                  />
                ) : (
                  <input
                    type="submit"
                    value="Add"
                    className="px-4 py-2 font-bold text-white bg-green-800 rounded-full hover:bg-green-700"
                  />
                )}
                {editMode && (
                  <button
                    onClick={() => {
                      reset({ name: "", dof: "", memberid: "", interests: "", });
                      setEditMode(false);
                    }}
                    className="px-4 py-2 ml-2 font-bold text-white bg-gray-800 rounded-full hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="flex-1 w-64 m-4 border bg-slate-300">
          <h1 className="text-2xl">Customers ({customers.length})</h1>
          <ul className="ml-8 list-disc">
            {customers.map((p) => (
              <li key={p._id}>
                <button className="border border-black p-1/2" onClick={startEdit(p)}>
                  📝
                </button>{" "}
                <button className="border border-black p-1/2" onClick={deleteById(p._id)}>
                  ❌
                </button>{" "}
                <Link href={`/customer/${p._id}`} className="font-bold">
                  {p.name}
                </Link>{" "}
                - {p.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
