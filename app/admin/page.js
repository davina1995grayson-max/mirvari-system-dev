"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";

export default function AdminPage() {
  const ADMIN_PASSWORD = "edik6762";
  const [menuData, setMenuData] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
const [password, setPassword] = useState("");
const logout = () => {
  setIsAuth(false);
  localStorage.removeItem("adminAuth");
  setPassword("");

  router.push("/");
};
  const [selectedSection, setSelectedSection] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const router = useRouter();
  const addItemToCategory = (categoryTitle) => {
  if (!newItemName || !newItemPrice) return;

  setMenuData((prev) =>
    prev.map((section) => {
      if (section.title !== categoryTitle) return section;

      return {
        ...section,
        items: [
          ...section.items,
          {
  name: newItemName,
  price: Number(newItemPrice),
  available: true,
  description: newItemDescription || null,
},
        ],
      };
    })
  );

  setNewItemName("");
  setNewItemPrice("");
  setActiveCategory("");
  setNewItemDescription("");
};
  const addCategory = () => {
  if (!newCategory.trim()) return;

  setMenuData((prev) => [
    ...prev,
    {
      title: newCategory,
      items: [],
    },
  ]);

  setNewCategory("");
};
const deleteCategory = (title) => {
  setMenuData((prev) =>
    prev.filter((s) => s.title !== title)
  );
};
const renameCategory = (oldTitle, newTitle) => {
  setMenuData((prev) =>
    prev.map((s) =>
      s.title === oldTitle
        ? { ...s, title: newTitle }
        : s
    )
  );
};
  // LOAD MENU FROM SUPABASE
useEffect(() => {
  const loadMenu = async () => {
    const { data, error } = await supabase
      .from("menu")
      .select("*");

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

    const formatted = Object.keys(grouped).map((category) => ({
      title: category,
      items: grouped[category],
    }));

    setMenuData(formatted);
  };

  loadMenu();
}, []);

  const updateName = (section, oldName, newName) => {
    setMenuData((prev) =>
      prev.map((s) =>
        s.title === section
          ? {
              ...s,
              items: s.items.map((i) =>
                i.name === oldName ? { ...i, name: newName } : i
              ),
            }
          : s
      )
    );
  };

  const updatePrice = (section, name, price) => {
    setMenuData((prev) =>
      prev.map((s) =>
        s.title === section
          ? {
              ...s,
              items: s.items.map((i) =>
                i.name === name ? { ...i, price: Number(price) } : i
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
const uploadMenuToSupabase = async () => {
  const dishes = [];

  menuData.forEach((section) => {
    section.items.forEach((item) => {
      dishes.push({
  name: item.name,
  price: item.price,
  category: section.title,
  available: item.available,
  description: item.description || null,
});
    });
  });

  // Удаляем старое меню
  const { error: deleteError } = await supabase
    .from("menu")
    .delete()
    .neq("id", 0);

  if (deleteError) {
    alert("Ошибка удаления: " + deleteError.message);
    return;
  }

  // Загружаем новое меню
  const { error } = await supabase
    .from("menu")
    .insert(dishes);

  if (error) {
    alert("Ошибка: " + error.message);
  } else {
    alert("Меню обновлено в Supabase!");
  }
};
  
if (!isAuth) {
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      <button
        onClick={() => window.location.href = "/"}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: "#ff4d4f",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        🚪 Выйти
      </button>

      <h2>🔐 Admin Login</h2>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={() => {
          if (password === ADMIN_PASSWORD) {
            setIsAuth(true);
            localStorage.setItem("adminAuth", "true");
          } else {
            alert("❌ Wrong password");
          }
        }}
      >
        Login
      </button>
    </div>
  );
}
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🕶️ ADMIN PANEL</h1>
    <button
  onClick={uploadMenuToSupabase}
  style={{
    padding: "10px 14px",
    borderRadius: 10,
    background: "#22c55e",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: 20,
    marginRight: 10,
  }}
>
  🚀 Загрузить меню в Supabase
</button>
    <button
  onClick={logout}
  style={{
    padding: "10px 14px",
    borderRadius: 10,
    background: "#ff4d4f",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: 20,
  }}
>
  🚪 Выйти
</button>

<div style={{ marginBottom: 20 }}>
  <h3>📂 Categories</h3>

  <input
    placeholder="New category"
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    style={{
      padding: 8,
      borderRadius: 8,
      marginRight: 10,
    }}
  />

  <button
    onClick={addCategory}
    style={{
      padding: "8px 14px",
      borderRadius: 8,
      background: "#f5c542",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    ➕ Add category
  </button>
</div>
      {/* ADD NEW ITEM */}
      <div style={{ marginBottom: 20 }}>
        <h3>➕ Add Item</h3>

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
          type="number"
          placeholder="Price"
          value={newItemPrice}
          onChange={(e) => setNewItemPrice(e.target.value)}
        />

            <textarea
  placeholder="Описание (для сетов)"
  value={newItemDescription}
  onChange={(e) => setNewItemDescription(e.target.value)}
  style={{
    width: "100%",
    minHeight: 70,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  }}
/>

        <button onClick={addItem}>Add</button>
      </div>

      <hr />

      {/* MENU LIST */}
      {menuData.map((section) => (
        <div
  key={section.title}
  style={{
    border: "1px solid #333",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    background: "#111",
  }}
>

  {/* HEADER КАТЕГОРИИ */}
  <input
  value={section.title}
  onChange={(e) =>
    renameCategory(section.title, e.target.value)
  }
  style={{
    fontSize: 20,
    fontWeight: "bold",
    color: "#f5c542",
    background: "transparent",
    border: "1px solid #333",
    borderRadius: 8,
    padding: "6px 10px",
    marginBottom: 10,
    width: "100%",
  }}
/>

          {section.items.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <input
                value={item.name}
                onChange={(e) =>
                  updateName(section.title, item.name, e.target.value)
                }
              />

              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  updatePrice(section.title, item.name, e.target.value)
                }
              />

              <button onClick={() => toggleItem(section.title, item.name)}>
                {item.available ? "🙈" : "👁️"}
              </button>

              <button
                onClick={() => deleteItem(section.title, item.name)}
                style={{ color: "red" }}
              >
                🗑
              </button>
            </div>
          ))}
            <div
  style={{
    marginTop: 10,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  }}
>
  <input
    placeholder="New dish"
    value={newItemName}
    onChange={(e) => {
      setActiveCategory(section.title);
      setNewItemName(e.target.value);
    }}
    style={{ padding: 6 }}
  />

  <input
    type="number"
    placeholder="Price"
    value={newItemPrice}
    onChange={(e) => {
      setActiveCategory(section.title);
      setNewItemPrice(e.target.value);
    }}
    style={{
      width: 90,
      padding: 6,
    }}
  />

  <button
    onClick={() =>
      addItemToCategory(section.title)
    }
  >
    ➕ Add
  </button>
</div>
        </div>
      ))}
    </div>
  );
}
