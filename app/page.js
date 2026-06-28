"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

export default function Page() {
  const [menuData, setMenuData] = useState([]);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [search, setSearch] = useState("");

  const cartRef = useRef(null);
  const router = useRouter();

  // LOAD MENU FROM SUPABASE
  useEffect(() => {
    const loadMenu = async () => {
      const { data } = await supabase.from("menu").select("*");

      const grouped = {};

      data?.forEach((item) => {
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
          (i) => `• ${i.name} x${i.qty || 1} = ${i.price * (i.qty || 1)}`
        )
        .join("\n") +
      `\n\n💰 TOTAL: ${total}`;

    window.open(
      `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
    );
  };

  // TABLE SELECT
  if (table === null) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Выбери стол</h2>

        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <button key={num} onClick={() => setTable(num)}>
            🪑 {num}
          </button>
        ))}
      </div>
    );
  }

  // MAIN UI
return (
  <div style={styles.page}>
    <h1 style={styles.logo}>🍽️ MIRVARI</h1>

    <div style={styles.table}>🪑 Table: {table}</div>

    <input
      style={styles.search}
      placeholder="Search dishes..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

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

    {/* CART */}
    <div style={styles.cart}>
      <h3>🛒 Cart</h3>

      {cart.map((item) => (
        <div key={item.name} style={styles.cartItem}>
          {item.name} x{item.qty || 1}
        </div>
      ))}

      <div style={styles.total}>Total: {total} AZN</div>

      <button style={styles.orderBtn} onClick={order}>
        Order Now
      </button>
    </div>
  </div>
);
