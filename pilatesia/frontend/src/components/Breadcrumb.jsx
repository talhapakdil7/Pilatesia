import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb-wrap" aria-label="breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, i) => (
          <li key={i} className={`breadcrumb-item ${i === items.length - 1 ? "active" : ""}`}>
            {item.to && i < items.length - 1 ? <Link to={item.to}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
