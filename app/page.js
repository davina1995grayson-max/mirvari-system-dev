  {/* 🍱 СЕТ */}
  {item.type === "set" && (
    <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
      <b>Состав:</b>
      {item.items?.map((i, idx) => (
        <div key={idx}>• {i.name}</div>
      ))}
    </div>
  )}
</div>
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
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontStyle: "italic",
    color: "#f5c542",
    cursor: "pointer",
    padding: 14,
    borderRadius: 14,
    background: "rgba(245,197,66,0.08)",
    marginTop: 24,
    marginBottom: 8,
    border: "1px solid rgba(245,197,66,0.15)",
    letterSpacing: "0.5px",
    boxShadow: "0 0 12px rgba(245,197,66,0.08)",
    transition: "all 0.2s ease",
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
  background: dark ? "#151515" : "#ffffff",
  marginTop: 10,
  padding: "14px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 16,
  border: "1px solid rgba(245,197,66,0.12)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "all 0.2s ease",
}}
              >
          
                <div>
  <div
  style={{
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 4,
    color: textColor,
  }}
>
  {item.name}
</div>

  <div
    style={{
      color: "#f5c542",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    {item.price} AZN
  </div>
      {item.description && (
  <div
    style={{
      marginTop: 6,
      fontSize: 13,
      opacity: 0.8,
      whiteSpace: "pre-line",
    }}
  >
    {Array.isArray(item.description)
      ? item.description.join("\n")
      : item.description}
  </div>
)}
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
  borderRadius: 12,
  width: 42,
  height: 42,
  cursor: "pointer",
  transition: "all 0.2s ease",
  background: "linear-gradient(135deg, #f5c542, #d8a92e)",
  color: "#111",
  fontWeight: "bold",
  fontSize: 18,
  boxShadow: "0 0 12px rgba(245,197,66,0.35)",
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
