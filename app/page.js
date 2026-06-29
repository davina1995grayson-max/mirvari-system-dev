"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Page() {
  const [menuData, setMenuData] = useState([]);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [search, setSearch] = useState("");

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

      setMenuData(
        Object.keys(grouped).map((cat) => ({
          title: cat,
          items: grouped[cat],
        }))
      );
    };

    loadMenu();
  }, []);

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

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

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

  // STEP 1: choose table
  if (table === null) {
    return (
      <div style={styles.page}>
        <h2>Выбери стол</h2>

        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            style={styles.tableBtn}
            onClick={() => setTable(num)}
          >
            🪑 {num}
          </button>
        ))}
      </div>
    );
  }

  // MAIN UI
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.logo}>🍽️ MIRVARI</h1>
        <div>🪑 {table}</div>
      </div>

      <input
        style={styles.search}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {menuData.map((section) => (
        <div key={section.title}>
          <h2 style={styles.sectionTitle}>{section.title}</h2>

          {section.items
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <div key={item.name} style={styles.card}>
                <div>
                  <div>{item.name}</div>
                  <div>{item.price} AZN</div>
                </div>

                <button onClick={() => addToCart(item)}>+</button>
              </div>
            ))}
        </div>
      ))}

      {cart.length > 0 && (
        <div style={styles.cart}>
          <div>🛒 {cart.length} items</div>
          <div>{total} AZN</div>

          <button onClick={order}>ORDER</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "#0b0b0b",
    minHeight: "100vh",
    color: "white",
    padding: 16,
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    color: "#f5c542",
  },

  search: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  sectionTitle: {
    color: "#f5c542",
    marginTop: 15,
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    background: "#1a1a1a",
    marginBottom: 8,
    borderRadius: 10,
  },

  cart: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#111",
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
  },

  tableBtn: {
    margin: 5,
    padding: 10,
  },
};
