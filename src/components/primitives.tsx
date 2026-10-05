"use client";
import { useEffect, useRef } from "react";
import {
  X,
  BookOpen,
  Utensils,
  Sparkles,
  Bookmark,
  Music,
  Heart,
  Moon,
  Link as LinkIcon,
  MessageCircle,
} from "lucide-react";
import type { Category } from "@/domain/model";
export function CategoryIcon({
  category,
  size = 22,
}: {
  category: Category;
  size?: number;
}) {
  const Icon = {
    other: LinkIcon,
    watch: BookOpen,
    eat: Utensils,
    do: Sparkles,
    want: Bookmark,
    listen: Music,
    faith: Moon,
    intimacy: Heart,
  }[category];
  return <Icon size={size} aria-hidden="true" strokeWidth={1.6} />;
}
export const categoryLabels: Record<Category, string> = {
  other: "An idea",
  watch: "Watch",
  eat: "Eat",
  do: "Do",
  want: "Want",
  listen: "Listen / Read",
  faith: "Faith Together",
  intimacy: "Intimacy",
};
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      <div className="modal-content">
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={22} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </dialog>
  );
}
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <MessageCircle size={25} strokeWidth={1.4} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function HomeSketch() {
  return (
    <svg
      className="home-sketch"
      viewBox="0 0 290 210"
      fill="none"
      aria-hidden="true"
    >
      <path d="M30 180H268" stroke="#AFA596" strokeWidth="2" />
      <path
        d="M62 179V92C62 50 97 28 136 28C175 28 211 50 211 92V180"
        fill="#EFE7D9"
      />
      <path
        d="M74 178V95C74 61 101 41 136 41C171 41 198 61 198 95V178"
        stroke="#D1C5B1"
        strokeWidth="2"
      />
      <path d="M134 42V180M76 110H198" stroke="#D1C5B1" strokeWidth="2" />
      <circle cx="173" cy="77" r="14" fill="#DABB8B" />
      <path
        d="M216 179C222 154 219 119 225 93"
        stroke="#748368"
        strokeWidth="3"
      />
      <path
        d="M222 137C198 136 195 118 203 114C216 109 224 127 222 137ZM224 120C245 119 251 102 244 98C232 91 223 111 224 120ZM225 101C208 97 208 81 215 79C225 78 226 93 225 101Z"
        fill="#879575"
      />
      <path d="M203 153H238L232 180H211L203 153Z" fill="#B5755C" />
      <rect x="79" y="160" width="51" height="19" rx="3" fill="#8B947D" />
      <rect x="85" y="144" width="44" height="16" rx="3" fill="#C89977" />
      <path d="M85 151H126M80 170H123" stroke="#F4EFE5" />
      <path
        d="M161 178C150 178 145 163 148 151H177C180 164 174 178 161 178Z"
        fill="#FAF7F0"
        stroke="#B9AB97"
        strokeWidth="2"
      />
      <path
        d="M177 154C195 150 195 171 176 168"
        stroke="#B9AB97"
        strokeWidth="2"
      />
      <path
        d="M153 134C147 127 161 122 155 114M166 134C160 127 174 122 168 114"
        stroke="#B9AB97"
        strokeLinecap="round"
      />
    </svg>
  );
}
