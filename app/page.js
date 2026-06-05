"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

  const DEFAULT_MENU = [
  {
    title: "🥗 Soyuq Qəlyanaltılar",
    items: [
      { name: "Pomidor & xiyar", price: 4, available: true },
      { name: "Göyərti çeşidləri", price: 2, available: true },
      { name: "Süzmə", price: 3, available: true },
      { name: "Zeytun çeşidləri", price: 3, available: true },
      { name: "Turşu çeşidləri", price: 4, available: true },
      { name: "Turşu xiyar", price: 2, available: true },
      { name: "Turşu pomidor", price: 2, available: true },
      { name: "Pendir çeşidləri", price: 5, available: true },
      { name: "Alça", price: 3, available: true },
      { name: "Hövsən soğanı", price: 2, available: true },
      { name: "Qatıq", price: 1, available: true },
      { name: "Acika", price: 2, available: true },
      { name: "Limon", price: 1, available: true },
      { name: "Çaşır", price: 3, available: true },
      { name: "Çörək", price: 1, available: true },
      { name: "Lavaş", price: 1, available: true },
    ],
  },
  {
    title: "🍲 Şorbalar",
    items: [
      { name: "Mərci", price: 3, available: true },
      { name: "Toyuq", price: 3, available: true },
      { name: "Düşbərə", price: 4, available: true },
      { name: "Lobya", price: 3, available: true },
      { name: "Borş", price: 4, available: true },
      { name: "Dovğa", price: 3, available: true },
    ],
  },
  {
    title: "🍔 Street Food / Fast Food",
    items: [
      { name: "Qamburger", price: 5, available: true },
      { name: "Şaurma", price: 5, available: true },
      { name: "Kartof fri", price: 3, available: true },
      { name: "Naggets", price: 3, available: true },
      { name: "Pendir çubuqları", price: 4, available: true },
    ],
  },
  {
    title: "🔥 İsti Qəlyanaltılar",
    items: [
      { name: "Blinçik (ət)", price: 2, available: true },
      { name: "Blinçik (kəsmik)", price: 1, available: true },
      { name: "Çolpa (qrildə / soyutma)", price: 12, available: true },
    ],
  },
  {
    title: "🥙 Salatlar",
    items: [
      { name: "Çoban salatı", price: 3, available: true },
      { name: "Manqal salatı", price: 4, available: true },
      { name: "Mimoza salatı", price: 4, available: true },
      { name: "Pomidor albalı", price: 6, available: true },
      { name: "Paytaxt salatı", price: 4, available: true },
      { name: "Sezar salatı", price: 8, available: true },
      { name: "Vitamin salatı", price: 3, available: true },
      { name: "Yunan salatı", price: 5, available: true },
      { name: "Xırt-xırt badımcan", price: 8, available: true },
    ],
  },
      {
    title: "🍚 Qarnirlər",
    items: [
      { name: "Ev sayağı kartof", price: 3, available: true },
      { name: "Düyü", price: 3, available: true },
      { name: "Qarabaşaq", price: 3, available: true },
    ],
  },
  {
    title: "🐟 Balıq Yeməkləri",
    items: [
      { name: "Forel (qaymaqlı sousda)", price: 0, available: true },
      { name: "Forel setkada (1 kq)", price: 0, available: true },
      { name: "Kütüm tavada (1 kq)", price: 0, available: true },
      { name: "Kefal setkada (1 kq)", price: 0, available: true },
      { name: "Nərə (nar-soğan)", price: 0, available: true },
      { name: "Balıq sırdağı", price: 0, available: true },
      { name: "Ağ balıq (pomidor-soğan)", price: 0, available: true },
      { name: "Ağ balıq (zoğal/zirinc)", price: 0, available: true },
    ],
  },
  {
    title: "🍖 Sac",
    items: [
      { name: "Sac Çolpa", price: 20, available: true },
      { name: "Quzu", price: 30, available: true },
      { name: "Can əti", price: 30, available: true },
      { name: "Qarışıq", price: 35, available: true },
    ],
  },
  {
    title: "🍢 Kabablar",
    items: [
      { name: "Lülə kabab", price: 7, available: true },
      { name: "Tikə kabab", price: 8, available: true },
      { name: "Antrikot", price: 9, available: true },
      { name: "Dana bastırma", price: 9, available: true },
      { name: "Toyuq kabab", price: 5, available: true },
      { name: "Toyuq çöp şiş", price: 3, available: true },
      { name: "Quzu içalat", price: 7, available: true },
      { name: "Xan kabab", price: 7, available: true },
      { name: "Ciyər quyruq", price: 7, available: true },
      { name: "Tərəvəz kabab", price: 1.5, available: true },
      { name: "Kartof quyruq", price: 5, available: true },
      { name: "Kartof lülə", price: 4, available: true },
      { name: "Kartof külləmə", price: 1, available: true },
      { name: "Napoleon kabab", price: 10, available: true },
      { name: "Sarma beyti", price: 10, available: true },
      { name: "Ağ balıq kababı", price: 15, available: true },
      { name: "Nərə balığı kababı", price: 20, available: true },
      { name: "Adana kabab", price: 7, available: true },
      { name: "Urfa kabab", price: 7, available: true },
    ],
  },
  {
    title: "🍛 İsti Yeməklər",
    items: [
      { name: "Yarpaq dolması", price: 7, available: true },
      { name: "Çolpa çığırtma", price: 15, available: true },
      { name: "Çolpa tabaka", price: 15, available: true },
      { name: "Quzu qovurma", price: 8, available: true },
      { name: "Çoban qovurma", price: 8, available: true },
      { name: "Quzu maça", price: 10, available: true },
      { name: "Dana buğlama", price: 8, available: true },
      { name: "Quzu soyutma", price: 8, available: true },
      { name: "Vişnəli can əti", price: 10, available: true },
      { name: "Nar qovurma", price: 8, available: true },
      { name: "Kefli beçə", price: 15, available: true },
      { name: "Spanaqlı toyuq", price: 6, available: true },
      { name: "Qaymaqlı can əti", price: 10, available: true },
      { name: "Qaymaqlı toyuq", price: 6, available: true },
      { name: "Medalyon steyk", price: 15, available: true },
      { name: "Tərəvəzli quzu qabırğa", price: 12, available: true },
      { name: "Toyuq steyk (göbələk sousu)", price: 7, available: true },
    ],
  },
  {
    title: "🥤 İçkilər",
    items: [
      { name: "Kompot", price: 3, available: true },
      { name: "Limonad", price: 3, available: true },
      { name: "Meyvə şirəsi", price: 4, available: true },
      { name: "Qazlı / qazsız su", price: 2, available: true },
      { name: "Cola / Fanta / Sprite", price: 3, available: true },
      { name: "Red Bull", price: 7, available: true },
      { name: "Ayran", price: 2, available: true },
      { name: "Çay", price: 3, available: true },
      { name: "Çay dəstgahı", price: 25, available: true },
    ],
  },
  {
    title: "🍰 Desertlər",
    items: [
      { name: "Mövsümi meyvə", price: 10, available: true },
      { name: "Dondurma", price: 3, available: true },
      { name: "Qarışıq çərəzlər", price: 14, available: true },
      { name: "Mürəbbə", price: 3, available: true },
      { name: "Şokolad", price: 3, available: true },
    ],
  },
  {
    title: "🍺 Pivə Məzələri",
    items: [
      { name: "Qızarmış saçaqlı pendir", price: 4, available: true },
      { name: "Saçaqlı pendir", price: 3, available: true },
      { name: "Qızarmış düşbərə", price: 4, available: true },
      { name: "Göbələk çipsi", price: 4, available: true },
      { name: "Krevetka", price: 4, available: true },
      { name: "Xırt-xırt zeytun", price: 5, available: true },
      { name: "Qızarmış pətənək", price: 4, available: true },
      { name: "Qızarmış boğaz", price: 3, available: true },
      { name: "Grenki", price: 5, available: true },
      { name: "Göbələk julien", price: 6, available: true },
      { name: "Qluşitel", price: 4, available: true },
      { name: "Bildirçin", price: 4, available: true },
      { name: "Çipsi", price: 4, available: true },
      { name: "Tum", price: 3, available: true },
      { name: "Suxari", price: 2, available: true },
      { name: "Noxud", price: 2, available: true },
      { name: "Qızartma noxud", price: 3, available: true },
      { name: "Qovrulmuş püstə", price: 5, available: true },
      { name: "Qovrulmuş fıstıq", price: 3, available: true },
      { name: "Soğan halqası", price: 3, available: true },
      { name: "Kopçonıy forel", price: 0, available: true },
    ],
  },
  {
    title: "🍻 Pivə & İçkilər",
    items: [
      { name: "Xırdalan", price: 0, available: true },
      { name: "Efes", price: 0, available: true },
      { name: "Efes Draft", price: 0, available: true },
      { name: "Efes Zero", price: 0, available: true },
      { name: "Miller", price: 0, available: true },
      { name: "NZS", price: 0, available: true },
    ],
  },
];
export default function Page() {

  const [openCategory, setOpenCategory] = useState(null);
  const [openedMenu, setOpenedMenu] = useState(null);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState("AZ"); 
  const [logoClicks, setLogoClicks] = useState(0);
  const [newItemName, setNewItemName] = useState("");
const [newItemPrice, setNewItemPrice] = useState("");
const [selectedSection, setSelectedSection] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
const pressTimer = useRef(null);
    const [menuData, setMenuData] = useState(DEFAULT_MENU);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
  const saved = localStorage.getItem("mirvariMenuData");

  if (saved) {
    try {
      setMenuData(JSON.parse(saved));
    } catch (e) {
      console.log("Menu load error");
    }
  }
}, []);
  useEffect(() => {
  localStorage.setItem(
    "mirvariMenuData",
    JSON.stringify(menuData)
  );
}, [menuData]);

  const cartRef = useRef(null);
  const router = useRouter();
 const handleLogoClick = () => {
  setLogoClicks((prev) => {
    const next = prev + 1;

    if (next >= 3) {
      router.push("/admin");
      return 0;
    }

    return next;
  });

  setTimeout(() => {
    setLogoClicks(0);
  }, 1500);
};
  const logoutAdmin = () => {
  setIsAdmin(false);
};
  const translations = {
AZ: {
title: "MIRVARI RESTORAN",
search: "Yemək axtar...",
order: "Sifariş",
},
RU: {
title: "РЕСТОРАН MIRVARI",
search: "Поиск блюда...",
order: "Заказ",
},
EN: {
title: "MIRVARI RESTAURANT",
search: "Search food...",
order: "Order",
},
};

const t = translations[lang]

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

  const btn = e.currentTarget;
  const cartEl = cartRef.current;

  if (!btn || !cartEl) return;

  // 🟡 создаём "пузырёк товара"
  const flyEl = document.createElement("div");
  flyEl.innerText = "🟡";
  flyEl.style.position = "fixed";
  flyEl.style.left = btn.getBoundingClientRect().left + "px";
  flyEl.style.top = btn.getBoundingClientRect().top + "px";
  flyEl.style.fontSize = "20px";
  flyEl.style.zIndex = 9999;
  flyEl.style.transition = "all 0.7s cubic-bezier(.5,-0.5,.5,1.5)";
  flyEl.style.pointerEvents = "none";

  document.body.appendChild(flyEl);

  const cartRect = cartEl.getBoundingClientRect();

  requestAnimationFrame(() => {
    flyEl.style.left = cartRect.left + "px";
    flyEl.style.top = cartRect.top + "px";
    flyEl.style.transform = "scale(0.2)";
    flyEl.style.opacity = "0";
  });

  setTimeout(() => {
    flyEl.remove();
  }, 800);
};

  const updatePrice = (sectionTitle, itemName, newPrice) => {
  setMenuData((prev) =>
    prev.map((section) => {
      if (section.title !== sectionTitle) return section;

      return {
        ...section,
        items: section.items.map((item) =>
          item.name === itemName
            ? { ...item, price: Number(newPrice) }
            : item
        ),
      };
    })
  );
};

  const updateName = (sectionTitle, oldName, newName) => {
  setMenuData((prev) =>
    prev.map((section) => {
      if (section.title !== sectionTitle) return section;

      return {
        ...section,
        items: section.items.map((item) =>
          item.name === oldName
            ? { ...item, name: newName }
            : item
        ),
      };
    })
  );
};

  const addNewItem = () => {
  if (!selectedSection || !newItemName || !newItemPrice) return;

  setMenuData((prev) =>
    prev.map((section) => {
      if (section.title !== selectedSection) return section;

      return {
        ...section,
        items: [
          ...section.items,
          {
            name: newItemName,
            price: Number(newItemPrice),
            available: true,
          },
        ],
      };
    })
  );

  setNewItemName("");
  setNewItemPrice("");
};
  
  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const order = () => {
  const itemsText = cart
    .map((i) => {
      const qty = i.qty || 1;
      return `• ${i.name} x${qty} = ${i.price * qty} AZN`;
    })
    .join("\n");

  const text =
    `🍽️ YENİ SİFARİŞ\n` +
    `🪑 Masa: ${table}\n\n` +
    `${itemsText}\n\n` +
    `💰 TOTAL: ${total} AZN`;

    window.open(
    `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
  );
};

  const callWaiter = () => {
  const text =
    `🔔 OFİSİANT ÇAĞIRILDI\n\n` +
    `🪑 Masa: ${table}`;

  window.open(
    `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
  );
};
  const callBill = () => {
  const text =
    `💳 HESAB İSTƏNİLDİ\n\n` +
    `🪑 Masa: ${table}`;

  window.open(
    `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
  );
};
  const bg = dark ? "#0f0f0f" : "#f5f5f5";
  const textColor = dark ? "white" : "black";
  const card = dark ? "#1e1e1e" : "#ffffff";

  if (table === null) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}>
        <h1
  style={{
    color: "#f5c542",
    cursor: "pointer",
    userSelect: "none",
  }}
  onClick={handleLogoClick}
>
  🍽️ {t.title}
</h1>
      
        <p>Zəhmət olmasa masanı seçin</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 15,
          width: "100%",
          maxWidth: 400
        }}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setTable(num)}
              style={{
                background: "#f5c542",
                border: "none",
                padding: 20,
                borderRadius: 16,
                fontSize: 20
              }}
            >
              🪑 {num}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
    background: bg, 
    color: textColor, 
    minHeight: "100vh", 
    padding: 20 }}>

      {/* HEADER */}
       <div style={{
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap"
}}>
  <h1 style={{ color: "#f5c542" }}>
    🍽️ {t.title}
  </h1>

  <button onClick={() => setDark(!dark)}>
    {dark ? "☀️ Light" : "🌙 Dark"}
  </button>

  <button onClick={() => setTable(null)}>
    🔄 Masa dəyiş
  </button>
</div>

      <p>📍 Baku · Pirallahi</p>
      <p>🪑 Masa: {table}</p>

<div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 10,
    marginBottom: 15,
  }}
>
  <button
    onClick={callWaiter}
    style={{
  flex: 1,
  padding: 14,
  borderRadius: 12,
  background: "#1e1e1e",
  color: "#f5c542",
  border: "1px solid #f5c542",
  boxShadow: "0 0 10px rgba(245,197,66,0.2)",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
}}
  >
    🔔 Ofisiant
  </button>

  <button
    onClick={callBill}
    style={{
  flex: 1,
  padding: 14,
  borderRadius: 12,
  background: "#1e1e1e",
  color: "#f5c542",
  border: "1px solid #f5c542",
  boxShadow: "0 0 10px rgba(245,197,66,0.2)",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
}}
  >
    💳 Hesab
  </button>
</div>
    
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.search}
        style={{ width: "100%", padding: 12, marginTop: 10 }}
      />

      {isAdmin && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.9)",
      zIndex: 99999,
      padding: 20,
      color: "white",
    }}
  >
    <h2>🕶️ Admin Panel</h2>
    <button
  onClick={logoutAdmin}
  style={{
    padding: "10px 14px",
    borderRadius: 8,
    background: "red",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: 10
  }}
>
  🚪 Выйти
</button>

    <button
      onClick={() => setAdminOpen(false)}
      style={{
        padding: 10,
        marginTop: 10,
        borderRadius: 10,
        border: "none",
        background: "#f5c542",
        fontWeight: "bold",
      }}
    >
      ❌ Close
    </button>

    <hr style={{ margin: "20px 0" }} />

    <h3>🍽️ Edit Menu</h3>

<hr style={{ margin: "20px 0" }} />

{menuData.map((section) => (
  <div key={section.title} style={{ marginBottom: 20 }}>
    <h4
  onClick={() =>
    setOpenCategory(
      openCategory === section.title ? null : section.title
    )
  }
  style={{
    color: "#f5c542",
    cursor: "pointer"
  }}
>
  {section.title}
</h4>

{openCategory === section.title && (
  <>
    {section.items.map((item) => (
      <div
        key={item.name}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 8,
          marginTop: 6,
          background: "#1e1e1e",
          borderRadius: 8,
        }}
      >
        <div>{item.name}</div>
      </div>
    ))}
  </>
)}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
  <input
    value={item.name}
    onChange={(e) =>
      updateName(section.title, item.name, e.target.value)
    }
    style={{
      padding: 4,
      borderRadius: 6,
      border: "1px solid #444",
      background: "#111",
      color: "white",
      width: 180,
    }}
  />

  <input
  type="number"
  value={item.price}
  onChange={(e) =>
    updatePrice(section.title, item.name, e.target.value)
  }
  style={{
    padding: 4,
    borderRadius: 6,
    border: "1px solid #444",
    background: "#111",
    color: "white",
    width: 80,
  }}
/>
          </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => {
              setMenuData((prev) =>
                prev.map((s) => ({
                  ...s,
                  items: s.items.map((i) =>
                    i.name === item.name
                      ? { ...i, available: !i.available }
                      : i
                  ),
                }))
              );
            }}
            style={{
              padding: "4px 8px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {item.available ? "🙈 Hide" : "👁️ Show"}
          </button>

          <button
            onClick={() => {
              setMenuData((prev) =>
                prev.map((s) => ({
                  ...s,
                  items: s.items.filter((i) => i.name !== item.name),
                }))
              );
            }}
            style={{
              padding: "4px 8px",
              border: "none",
              borderRadius: 6,
              background: "red",
              color: "white",
              cursor: "pointer",
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    ))}
    </div>
)}
      
      {/* MENU */}
      {menuData.map(section => (
        <div key={section.title}>
          <h2
  onClick={() =>
    setOpenedMenu(
      openedMenu === section.title
        ? null
        : section.title
    )
  }
  style={{
    color: "#f5c542",
    cursor: "pointer",
    padding: 12,
    borderRadius: 12,
    background: "rgba(245,197,66,0.08)",
    marginTop: 20,
  }}
>
  {section.title}
  {" "}
  {openedMenu === section.title ? "▲" : "▼"}
</h2>
{openedMenu === section.title && (
  <>
        {section.items
  .filter(item => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchSearch && item.available;
  })
  .map(item => (
              <div
                key={item.name}
                style={{
  background: card,
  marginTop: 12,
  padding: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 16,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "0.2s",
}}
              >
          
                <div>
  <div style={{ fontWeight: "bold" }}>
    {item.name}
  </div>

  <div>
    {item.price} AZN
  </div>
</div>

<button
  onClick={(e) => {
    addToCart(item, e);

    const el = e.currentTarget;
    el.style.transform = "scale(0.85)";
    el.style.transition = "0.1s";

    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 120);
  }}
  style={{
    marginLeft: 8,
    border: "none",
    borderRadius: 10,
    padding: "4px 10px",
    cursor: "pointer",
    transition: "0.2s",
    background: "#f5c542",
    fontWeight: "bold",
  }}
>
  ➕
</button>
                </div>
            ))}
    </>
)}

        </div>
      ))}

      {/* MODAL */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
  onClick={(e) => e.stopPropagation()}
  style={{
    background: card,
    width: "90%",
    maxWidth: 400,
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    padding: 20,
  }}
>
            <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  }}
>
  <h2 style={{ margin: 0 }}>🛒 Səbət</h2>

  <button
    onClick={() => setCartOpen(false)}
    style={{
      border: "none",
      background: "transparent",
      fontSize: 24,
      cursor: "pointer",
      color: textColor,
      padding: 0,
    }}
  >
    ✖
  </button>
</div>

<div
  style={{
    flex: 1,
    overflowY: "auto",
    marginTop: 10,
    marginBottom: 10,
  }}
>

            {cart.map((item) => (
  <div
    key={item.name}
    style={{
      marginBottom: 12,
      paddingBottom: 10,
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* INFO */}
      <div>
        <div
          style={{
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          {item.name}
        </div>

        <small
          style={{
            opacity: 0.7,
          }}
        >
          {item.price} AZN
        </small>
      </div>

      {/* CONTROLS */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* MINUS */}
        <button
          onClick={() =>
            setCart((prev) =>
              prev
                .map((i) =>
                  i.name === item.name
                    ? {
                        ...i,
                        qty: (i.qty || 1) - 1
                      }
                    : i
                )
                .filter((i) => (i.qty || 0) > 0)
            )
          }
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ➖
        </button>

        {/* QTY */}
        <span
          style={{
            minWidth: 20,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {item.qty}
        </span>

        {/* PLUS */}
        <button
          onClick={() =>
            setCart((prev) =>
              prev.map((i) =>
                i.name === item.name
                  ? {
                      ...i,
                      qty: i.qty + 1,
                    }
                  : i
              )
            )
          }
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ➕
        </button>

        {/* DELETE */}
        <button
          onClick={() =>
            setCart((prev) =>
              prev.filter((i) => i.name !== item.name)
            )
          }
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
))}
  </div>
            <h3>💰 {total} AZN</h3>

<button
  onClick={() => {
  if (window.confirm("Səbəti tam təmizləmək istəyirsiniz?")) {
    setCart([]);
  }
}}
  style={{
    width: "100%",
    padding: 10,
    marginBottom: 10,
    border: "none",
    borderRadius: 10,
    background: "#cc3333",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  🗑️ Səbəti təmizlə
</button>

<button
  onClick={order}
  style={{
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 10,
    boxShadow: "0 6px 20px rgba(245,197,66,0.5)",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  {t.order}
</button>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <div
  ref={cartRef}
  onClick={() => setCartOpen(true)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: "#f5c542",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          cursor: "pointer",
          zIndex: 9999
        }}
      >
        🛒 {cart.length}
      </div>

    </div>
  );
}
