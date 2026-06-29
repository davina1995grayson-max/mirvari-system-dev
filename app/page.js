"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

export default function Page() {
  const [menuData, setMenuData] = useState([]);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [dark] = useState(true);
  const [search, setSearch] = useState("");
  const cartRef = useRef(null);
  const router = useRouter();

  // 🔥 LOAD MENU (SAFE)
  useEffect(() => {
    const loadMenu = async () => {
      const { data, error } = await supabase.from("menu").select("*");

      if (error || !data) {
        console.log("Supabase error:", error);
        return;
      }

      const grouped = {};

      data.forEach((item) => {
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

  // 🛒 ADD TO CART
  const addToCart = (item, e) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);

      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: (i.qty || 1) + 1 } : i
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });

    if (!e || !cartRef.current) return;

    const btn = e.currentTarget;
    const cartEl = cartRef.current;

    const fly = document.createElement("div");
    fly.innerText = "🟡";
    fly.style.position = "fixed";
    fly.style.left = btn.getBoundingClientRect().left + "px";
    fly.style.top = btn.getBoundingClientRect().top + "px";
    fly.style.transition = "all 0.7s ease";
    fly.style.zIndex = 9999;

    document.body.appendChild(fly);

    requestAnimationFrame(() => {
      const rect = cartEl.getBoundingClientRect();
      fly.style.left = rect.left + "px";
      fly.style.top = rect.top + "px";
      fly.style.opacity = "0";
      fly.style.transform = "scale(0.3)";
    });

    setTimeout(() => fly.remove(), 800);
  };

  const total = cart.reduce(
    (sum, i) => sum + (i.price || 0) * (i.qty || 1),
    0
  );

  const order = () => {
    const text =
      "🍽️ NEW ORDER\n\n" +
      cart
        .map(
          (i) =>
            `• ${i.name} x${i.qty || 1} = ${
              i.price * (i.qty || 1)
            } AZN`
        )
        .join("\n") +
      `\n\nTOTAL: ${total} AZN`;

    window.open(
      `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
    );
  };

  // 🪑 TABLE SELECT SCREEN
  if (table === null) {
    return (
      <div style={{ padding: 20, color: "#fff", background: "#0b0b0b", minHeight: "100vh" }}>
        <h2>Выбери стол</h2>

        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setTable(num)}
            style={{
              margin: 5,
              padding: 15,
              background: "#f5c542",
              border: "none",
              borderRadius: 10,
            }}
          >
            🪑 {num}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: dark ? "#0f0f0f" : "#fff", minHeight: "100vh", color: dark ? "#fff" : "#000", padding: 20 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🍽️ MIRVARI</h1>
        <div>🪑 {table}</div>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      {/* MENU */}
      {menuData.map((section) => (
        <div key={section.title}>
          <h2 style={{ color: "#f5c542" }}>{section.title}</h2>

          {section.items
            .filter((i) =>
              i.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 10,
                  marginBottom: 10,
                  background: "#1a1a1a",
                  borderRadius: 10,
                }}
              >
                <div>
                  <div>{item.name}</div>
                  <small>{item.price} AZN</small>
                </div>

                <button
                  onClick={(e) => addToCart(item, e)}
                  style={{
                    background: "#f5c542",
                    border: "none",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  +
                </button>
              </div>
            ))}
        </div>
      ))}

      {/* CART BUTTON */}
      <div
        ref={cartRef}
        onClick={() => setCartOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#f5c542",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        🛒 {cart.length}
      </div>

      {/* CART MODAL */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              color: "#000",
              width: "90%",
              maxWidth: 400,
              margin: "80px auto",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <h2>🛒 Cart</h2>

            {cart.map((i) => (
              <div key={i.name}>
                {i.name} x{i.qty}
              </div>
            ))}

            <h3>Total: {total} AZN</h3>

            <button
              onClick={order}
              style={{
                width: "100%",
                padding: 10,
                background: "#f5c542",
                border: "none",
                marginTop: 10,
              }}
            >
              Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
