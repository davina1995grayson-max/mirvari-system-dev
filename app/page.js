"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

/* ================= COMPONENT ================= */

export default function Page() {
  const router = useRouter();
  const cartRef = useRef(null);

  /* STATE */
  const [menuData, setMenuData] = useState([]);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openedMenu, setOpenedMenu] = useState(null);

  /* ADMIN */
  const [isAdmin, setIsAdmin] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  /* UI */
  const [dark] = useState(true);
  const [lang] = useState("AZ");

  /* LOAD MENU (SUPABASE ONLY) */
  useEffect(() => {
    const loadMenu = async () => {
      const { data, error } = await supabase.from("menu").select("*");

      if (error) {
        console.log(error);
        return;
      }

      const grouped = {};

      data?.forEach((item) => {
        if (!grouped[item.category]) grouped[item.category] = [];

        grouped[item.category].push({
          name: item.name,
          price: item.price,
          available: item.available ?? true,
          type: item.type || null,
          items: item.items || null,
        });
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

  /* CART */
  const addToCart = (item, e) => {
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

    if (!e?.currentTarget || !cartRef.current) return;

    const btn = e.currentTarget;
    const cartEl = cartRef.current;

    const flyEl = document.createElement("div");
    flyEl.innerText = "🟡";
    flyEl.style.position = "fixed";
    flyEl.style.left = btn.getBoundingClientRect().left + "px";
    flyEl.style.top = btn.getBoundingClientRect().top + "px";
    flyEl.style.transition = "all 0.7s ease";
    flyEl.style.zIndex = 9999;

    document.body.appendChild(flyEl);

    const cartRect = cartEl.getBoundingClientRect();

    requestAnimationFrame(() => {
      flyEl.style.left = cartRect.left + "px";
      flyEl.style.top = cartRect.top + "px";
      flyEl.style.opacity = "0";
    });

    setTimeout(() => flyEl.remove(), 800);
  };

  /* TOTAL */
  const total = cart.reduce(
    (sum, i) => sum + (i.price || 0) * (i.qty || 1),
    0
  );

  /* ORDER */
  const order = () => {
    const text =
      `🍽️ ORDER\n🪑 Table: ${table}\n\n` +
      cart
        .map(
          (i) =>
            `• ${i.name} x${i.qty} = ${i.price * i.qty} AZN`
        )
        .join("\n") +
      `\n\n💰 TOTAL: ${total} AZN`;

    window.open(
      `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
    );
  };

  /* TABLE SELECT */
  if (!table) {
    return (
      <div style={{ padding: 20, color: "white", background: "#111", minHeight: "100vh" }}>
        <h2>Выбери стол</h2>

        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setTable(num)}
            style={{ margin: 5, padding: 20 }}
          >
            🪑 {num}
          </button>
        ))}
      </div>
    );
  }

  /* MAIN UI */
  return (
    <div style={{ background: "#0f0f0f", color: "white", minHeight: "100vh", padding: 20 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🍽️ MIRVARI</h1>
        <div>🪑 {table}</div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      {/* MENU */}
      {menuData.map((section) => (
        <div key={section.title}>
          <h2 onClick={() =>
            setOpenedMenu(openedMenu === section.title ? null : section.title)
          }>
            {section.title}
          </h2>

          {openedMenu === section.title &&
            section.items
              .filter((i) =>
                i.name.toLowerCase().includes(search.toLowerCase()) &&
                i.available
              )
              .map((item) => (
                <div key={item.name} style={{ margin: 10 }}>
                  <div>
                    {item.name} - {item.price} AZN
                  </div>

                  <button onClick={(e) => addToCart(item, e)}>
                    ➕
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
          background: "#f5c542",
          padding: 20,
          borderRadius: "50%",
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
            background: "rgba(0,0,0,0.7)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#222",
              margin: "10% auto",
              padding: 20,
              width: 300,
            }}
          >
            <h3>Cart</h3>

            {cart.map((item) => (
              <div key={item.name}>
                {item.name} x{item.qty}
              </div>
            ))}

            <h4>Total: {total} AZN</h4>

            <button onClick={order}>
              Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
