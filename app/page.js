"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

export default function Page() {
  const router = useRouter();
  const cartRef = useRef(null);

  const [menuData, setMenuData] = useState([]);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");

  // LOAD MENU
  useEffect(() => {
    const loadMenu = async () => {
      const { data } = await supabase.from("menu").select("*");

      const grouped = {};

      data?.forEach((item) => {
        if (!grouped[item.category]) grouped[item.category] = [];
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

  const total = cart.reduce(
    (sum, i) => sum + i.price * (i.qty || 1),
    0
  );

  const order = () => {
    const text =
      `🍽️ NEW ORDER\n🪑 Table: ${table}\n\n` +
      cart
        .map(
          (i) =>
            `• ${i.name} x${i.qty || 1} = ${
              i.price * (i.qty || 1)
            } AZN`
        )
        .join("\n") +
      `\n\n💰 TOTAL: ${total} AZN`;

    window.open(
      `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
    );
  };

  // SELECT TABLE
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

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.logo}>🍽️ MIRVARI</h1>
        <div style={styles.table}>🪑 {table}</div>
      </div>

      {/* SEARCH */}
      <input
        style={styles.search}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* MENU */}
      {menuData.map((section) => (
        <div key={section.title} style={styles.section}>
          <h2 style={styles.sectionTitle}>{section.title}</h2>

          <div style={styles.grid}>
            {section.items
              .filter((i) =>
                i.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <div key={item.name} style={styles.card}>
                  <div>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.price}>
                      {item.price} AZN
                    </div>
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

      {/* CART BUTTON */}
      {cart.length > 0 && (
        <div style={styles.cartBar}>
          <span>🛒 {cart.length}</span>
          <span>{total} AZN</span>

          <button onClick={order} style={styles.orderBtn}>
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
  },

  table: {
    opacity: 0.8,
  },

  search: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
    border: "none",
  },

  sectionTitle: {
    color: "#f5c542",
    marginTop: 20,
  },

  grid: {
    display: "grid",
    gap: 10,
  },

  card: {
    background: "#1a1a1a",
    padding: 12,
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
  },

  itemName: {
    fontWeight: "bold",
  },

  price: {
    opacity: 0.7,
  },

  addBtn: {
    background: "#f5c542",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
  },

  cartBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#141414",
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
  },

  orderBtn: {
    background: "#f5c542",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
  },

  tableBtn: {
    padding: 20,
    margin: 5,
  },
};
