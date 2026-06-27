"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";

export default function AdminPage() {
  const ADMIN_PASSWORD = "edik6762";

  const [menuData, setMenuData] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const router = useRouter();

  // LOGIN CHECK
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") setIsAuth(true);
  }, []);

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem("adminAuth");
    router.push("/");
  };

  // LOAD MENU
  useEffect(() => {
    if (!isAuth) return;

    const loadMenu = async () => {
      const { data, error } = await supabase.from("menu").select("*");

      if (error) {
        console.log(error);
        return;
      }

      const grouped = {};

      data.forEach((item) => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }

        grouped[item.category].push({
          name: item.name,
          price: item.price,
          available: item.available,
        });
      });

      const formatted = Object.keys(grouped).map((cat) => ({
        title: cat,
        items: grouped[cat],
      }));

      setMenuData(formatted);
    };

    loadMenu();
  }, [isAuth]);

  // CATEGORY
  const addCategory = () => {
    if (!newCategory.trim()) return;

    setMenuData((prev) => [
      ...prev,
      { title: newCategory, items: [] },
    ]);

    setNewCategory("");
  };

  const renameCategory = (oldTitle, newTitle) => {
    setMenuData((prev) =>
      prev.map((s) =>
        s.title === oldTitle ? { ...s, title: newTitle } : s
      )
    );
  };

  // ITEMS
  const addItem = () => {
    if (!selectedSection || !newItemName || !newItemPrice) return;

    setMenuData((prev) =>
      prev.map((s) =>
        s.title === selectedSection
          ? {
              ...s,
              items: [
                ...s.items,
                {
                  name: newItemName,
                  price: Number(newItemPrice),
                  available: true,
                },
              ],
            }
          : s
      )
    );

    setNewItemName("");
    setNewItemPrice("");
  };

  const updateItem = (section, oldName, field, value) => {
    setMenuData((prev) =>
      prev.map((s) =>
        s.title === section
          ? {
              ...s,
              items: s.items.map((i) =>
                i.name === oldName
                  ? { ...i, [field]: value }
                  : i
              ),
            }
          : s
      )
    );
  };

  const deleteItem = (section, name) => {
    setMenuData((prev) =>
      prev.map((s) =>
        s.title === section
          ? {
              ...s,
              items: s.items.filter((i) => i.name !== name),
            }
          : s
      )
    );
  };

  const toggleItem = (section, name) => {
    setMenuData((prev) =>
      prev.map((s) =>
        s.title === section
          ? {
              ...s,
              items: s.items.map((i) =>
                i.name === name
                  ? { ...i, available: !i.available }
                  : i
              ),
            }
          : s
      )
    );
  };

  // SAVE TO SUPABASE
  const uploadMenuToSupabase = async () => {
    const dishes = [];

    menuData.forEach((section) => {
      section.items.forEach((item) => {
        dishes.push({
          name: item.name,
          price: item.price,
          category: section.title,
          available: item.available,
        });
      });
    });

    await supabase.from("menu").delete().neq("id", 0);
    const { error } = await supabase.from("menu").insert(dishes);

    if (error) {
      alert(error.message);
    } else {
      alert("Menu updated!");
    }
  };

  // LOGIN SCREEN
  if (!isAuth) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Admin Login</h2>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button
          onClick={() => {
            if (password === ADMIN_PASSWORD) {
              setIsAuth(true);
              localStorage.setItem("adminAuth", "true");
            } else {
              alert("Wrong password");
            }
          }}
        >
          Login
        </button>
      </div>
    );
  }

  // PANEL
  return (
    <div style={{ padding: 20 }}>
      <h1>ADMIN PANEL</h1>

      <button onClick={uploadMenuToSupabase}>
        Save to Supabase
      </button>

      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Add Category</h3>
      <input
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button onClick={addCategory}>Add</button>

      <hr />

      <h3>Add Item</h3>

      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
      >
        <option value="">Select category</option>
        {menuData.map((s) => (
          <option key={s.title} value={s.title}>
            {s.title}
          </option>
        ))}
      </select>

      <input
        placeholder="Name"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
      />

      <input
        placeholder="Price"
        type="number"
        value={newItemPrice}
        onChange={(e) => setNewItemPrice(e.target.value)}
      />

      <button onClick={addItem}>Add Item</button>

      <hr />

      {menuData.map((section) => (
        <div key={section.title}>
          <input
            value={section.title}
            onChange={(e) =>
              renameCategory(section.title, e.target.value)
            }
          />

          {section.items.map((item) => (
            <div key={item.name}>
              <input
                value={item.name}
                onChange={(e) =>
                  updateItem(section.title, item.name, "name", e.target.value)
                }
              />

              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(section.title, item.name, "price", Number(e.target.value))
                }
              />

              <button
                onClick={() => toggleItem(section.title, item.name)}
              >
                {item.available ? "Hide" : "Show"}
              </button>

              <button onClick={() => deleteItem(section.title, item.name)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
