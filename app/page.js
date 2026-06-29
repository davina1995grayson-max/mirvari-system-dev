"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Page() {
  const [menuData, setMenuData] = useState([]);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [search, setSearch] = useState("");

  // LOAD MENU
  useEffect(() => {
    const loadMenu = async () => {
      const { data } = await supabase.from("menu").select("*");

      const grouped = {};

      data?.forEach((item) => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }

        grouped[item.category].push(item);
      });

      const formatted = Object.keys(grouped).map((cat) => ({
        title: cat,
        items: grouped[cat],
      }));

      setMenuData(formatted);
    };

    loadMenu();
  }, []);

  // ADD TO CART
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);

      if (existing) {
        return prev.map((i) =>
          i.name === item.name
            ? { ...i, qty: (i.qty || 1) + 1 }
            : i
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  // TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  // ORDER
  const order = () => {
    const text =
      "🍽️ NEW ORDER\n" +
      `🪑 Table: ${table}\n\n` +
      cart
        .map(
          (i) =>
            `• ${i.name} x${i.qty || 1} = ${i.price * (i.qty || 1)} AZN`
        )
        .join("\n") +
      `\n\n💰 TOTAL: ${total} AZN`;

    window.open(
      `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
    );
  };

  // TABLE SELECT SCREEN
  if (table === null) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Выбери стол</h2>

        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setTable(num)}
            style={{ margin: 5, padding: 10 }}
          >
            🪑 {num}
          </button>
        ))}
      </div>
    );
  }

  // MAIN UI
  return (
    <div style={{ padding: 20 }}>
      <h1>MENU</h1>

      <p>Table: {table}</p>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {menuData.map((section) => (
        <div key={section.title}>
          <h3>{section.title}</h3>

          {section.items
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <div key={item.name}>
                <span>
                  {item.name} — {item.price} AZN
                </span>

                <button onClick={() => addToCart(item)}>
                  Add
                </button>
              </div>
            ))}
        </div>
      ))}

      <hr />

      <h3>Cart</h3>

      {cart.map((item) => (
        <div key={item.name}>
          {item.name} x{item.qty || 1}
        </div>
      ))}

      <h3>Total: {total} AZN</h3>

      <button onClick={order}>Order</button>
    </div>
  );
}
