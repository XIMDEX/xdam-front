import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../constants';

function CdnRenderPage() {
  const {pathname} = useLocation();
  const hash = pathname.split('/')?.[2];

  if (!hash) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <h1>Resource not found</h1>
        </div>
    )
  }
  return (
    <iframe
        title="Contenido Externo"
        width="100%"
        height="500"
        style={{
            border: "none",
            overflow: "hidden",
            height: "99dvh",
            width: "100dvw",
            padding: 0,
            margin: 0,
        }}
        src={`${API_BASE_URL}/cdn/resource/${hash}/render`}
    />
  );
}

export default CdnRenderPage;
