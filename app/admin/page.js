"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* -------------------- SORTABLE CARD -------------------- */

function SortableCategory({ section, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="card">
      <div {...attributes} {...listeners} style={{ cursor: "grab" }}>
        <h3 style={{ color: "#f5c542" }}>📂 {section.title}</h3>
      </div>

      {children}
    </div>
  );
}

/* -------------------- MAIN -------------------- */

export default function AdminPage() {
  const router = useRouter();

  const ADMIN_PASSWORD = "edik6762";

  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

  const [menuData, setMenuData] = useState([]);

  const [search, setSearch] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") setIsAuth(true);
  }, []);

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem("adminAuth");
    router.push("/");
  };

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    if (!isAuth) return;

    const load = async () => {
      const { data } = await supabase.from("menu").select("*");

      const grouped = {};

      data.forEach((item) => {
        if (!grouped[item.category]) grouped[item.category] = [];

        grouped[item.category].push(item);
      });

      const formatted = Object.keys(grouped).map((k) => ({
        title: k,
        items: grouped[k],
      }));

      setMenuData(formatted);
    };

    load();
  }, [isAuth]);

  /* ---------------- DRAG CATEGORIES ---------------- */

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setMenuData((items) => {
      const oldIndex = items.findIndex((i) => i.title === active.id);
      const newIndex = items.findIndex((i) => i.title === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  /* ---------------- CATEGORY ---------------- */

  const addCategory = () => {
    if (!newCategory.trim()) return;

    setMenuData((prev) => [
      ...prev,
      { title: newCategory, items: [] },
    ]);

    setNewCategory("");
  };

  const deleteCategory = (title) => {
    setMenuData((prev) => prev.filter((c) => c.title !== title));
  };

  /* ---------------- ITEMS ---------------- */

  const addItem = (category) => {
    if (!newItemName || !newItemPrice) return;

    setMenuData((prev) =>
      prev.map((c) =>
        c.title === category
          ? {
              ...c,
              items: [
                ...c.items,
                {
                  name: newItemName,
                  price: Number(newItemPrice),
                  available: true,
                },
              ],
            }
          : c
      )
    );

    setNewItemName("");
    setNewItemPrice("");
  };

  const deleteItem = (cat, name) => {
    setMenuData((prev) =>
      prev.map((c) =>
        c.title === cat
          ? {
              ...c,
              items: c.items.filter((i) => i.name !== name),
            }
          : c
      )
    );
  };

  const toggleItem = (cat, name) => {
    setMenuData((prev) =>
      prev.map((c) =>
        c.title === cat
          ? {
              ...c,
              items: c.items.map((i) =>
                i.name === name
                  ? { ...i, available: !i.available }
                  : i
              ),
            }
          : c
      )
    );
  };

  /* ---------------- SEARCH ---------------- */

  const filtered = menuData.map((section) => ({
    ...section,
    items: section.items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  /* ---------------- LOGIN ---------------- */

  if (!isAuth) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Admin Login</h2>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => {
            if (password === ADMIN_PASSWORD) {
              setIsAuth(true);
              localStorage.setItem("adminAuth", "true");
            } else alert("Wrong password");
          }}
        >
          Login
        </button>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 20, color: "white", background: "#0b0b0b", minHeight: "100vh" }}>

      <h1>🕶️ ADMIN PANEL</h1>

      <button onClick={logout}>Logout</button>

      <input
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginLeft: 10 }}
      />

      <hr />

      <h3>Add Category</h3>
      <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
      <button onClick={addCategory}>Add</button>

      <hr />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={menuData.map((c) => c.title)}
          strategy={verticalListSortingStrategy}
        >
          {filtered.map((section) => (
            <SortableCategory key={section.title} section={section}>

              <button onClick={() => deleteCategory(section.title)}>
                Delete category
              </button>

              <div>
                {section.items.map((item) => (
                  <div key={item.name} style={{ display: "flex", gap: 8 }}>
                    <span>{item.name}</span>
                    <span>{item.price} ₼</span>

                    <button onClick={() => toggleItem(section.title, item.name)}>
                      {item.available ? "Hide" : "Show"}
                    </button>

                    <button onClick={() => deleteItem(section.title, item.name)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <input
                  placeholder="name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />

                <input
                  placeholder="price"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                />

                <button onClick={() => addItem(section.title)}>
                  Add item
                </button>
              </div>

            </SortableCategory>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
