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

      setMenuData(
        Object.keys(grouped).map((cat) => ({
          title: cat,
          items: grouped[cat],
        }))
      );
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

  // TABLE SELECT
  if (table === null) {
    return (
      <div style={styles.page}>
        <h2 style={styles.logo}>🍽️ MIRVARI RESTAURANT</h2>

        <p>Выбери стол</p>

        <div style={styles.tableGrid}>
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
      </div>
    );
  }

  // MAIN UI
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.logo}>🍽️ MIRVARI</h1>
        <div style={styles.table}>🪑 {table}</div>
      </div>

      {/* SEARCH */}
      <input
        style={styles.search}
        placeholder="Search dishes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* MENU */}
      {menuData.map((section) => (
        <div key={section.title} style={styles.section}>
          <h2 style={styles.sectionTitle}>{section.title}</h2>

          <div style={styles.grid}>
            {section.items
              .filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <div key={item.name} style={styles.card}>
                  <div>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.price}>{item.price} AZN</div>
                  </div>

                  <button
                    style={styles.addBtn}
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* CART BAR */}
      {cart.length > 0 && (
        <div style={styles.cartBar}>
          <span>🛒 {cart.length} items</span>
          <span>{total} AZN</span>

          <button style={styles.orderBtn} onClick={order}>
            Order
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

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
    fontSize: 24,
    fontWeight: "bold",
  },

  table: {
    opacity: 0.7,
  },

  search: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    marginTop: 10,
    marginBottom: 20,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    color: "#f5c542",
    marginBottom: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
  },

  card: {
    background: "#1a1a1a",
    padding: 14,
    borderRadius: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemName: {
    fontWeight: "bold",
  },

  price: {
    opacity: 0.7,
    fontSize: 13,
  },

  addBtn: {
    background: "#f5c542",
    border: "none",
    borderRadius: 10,
    padding: "6px 12px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  cartBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#141414",
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #333",
  },

  orderBtn: {
    background: "#f5c542",
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: "bold",
  },

  tableGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
    marginTop: 20,
  },

  tableBtn: {
    padding: 15,
    borderRadius: 12,
    border: "none",
    background: "#f5c542",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
                }
