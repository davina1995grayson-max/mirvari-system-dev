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

  return (
    <div style={styles.page}>
      <h1 style={styles.logo}>🍽️ MIRVARI</h1>

      <div>🪑 Table: {table}</div>

      <input
        style={styles.search}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {menuData.map((section) => (
        <div key={section.title}>
          <h3 style={styles.sectionTitle}>{section.title}</h3>

          {section.items
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <div key={item.name} style={styles.card}>
                <div>
                  <b>{item.name}</b>
                  <div>{item.price} AZN</div>
                </div>

                <button onClick={() => addToCart(item)}>+</button>
              </div>
            ))}
        </div>
      ))}

      <div style={styles.cart}>
        <h3>Cart</h3>

        {cart.map((i) => (
          <div key={i.name}>
            {i.name} x{i.qty || 1}
          </div>
        ))}

        <h3>Total: {total} AZN</h3>

        <button onClick={order} style={styles.orderBtn}>
          Order
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#0f0f0f",
    minHeight: "100vh",
    color: "white",
    padding: 20,
  },

  logo: {
    color: "#f5c542",
    fontSize: 28,
  },

  search: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
  },

  sectionTitle: {
    color: "#f5c542",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    background: "#1b1b1b",
    padding: 10,
    marginTop: 8,
    borderRadius: 10,
  },

  cart: {
    marginTop: 20,
    padding: 10,
    background: "#1a1a1a",
    borderRadius: 10,
  },

  orderBtn: {
    width: "100%",
    padding: 12,
    background: "#f5c542",
    border: "none",
    marginTop: 10,
    fontWeight: "bold",
  },

  tableBtn: {
    margin: 5,
    padding: 10,
  },
};
