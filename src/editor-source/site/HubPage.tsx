import * as React from "react";
import { useLocation } from "react-router-dom";
import type { Doc } from "@/editor-source/source/contentTree";
import { hubBySlug } from "./pageMap";
import { SiteInspector } from "./SiteInspector";

/*
  ХАБ ТРЕКА В ИНСТРУМЕНТЕ СВЕРКИ — «Для компаний» и «Для НКО».

  Обычные страницы сайта врастают из источника (GeneratedPage) и сразу
  разворачиваются в инспектор. Хабы написаны руками — дерева узлов у них нет, —
  и раньше они выпадали из инструмента: обвязка исчезала, источник тоже. Здесь
  та же обвязка, но правая колонка рисует саму страницу как есть.
*/
export function HubPage({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const page = hubBySlug(pathname);

  // Хаба нет в карте — показываем страницу без инструмента (лучше, чем пусто).
  if (!page) return <>{children}</>;

  // Дерево узлов пустое: страница собрана руками, JSON для неё не строится.
  const pageDoc: Doc = { module: page.module, children: [] };

  return (
    <SiteInspector page={page} pageDoc={pageDoc} tocItems={[]} body={children} />
  );
}
