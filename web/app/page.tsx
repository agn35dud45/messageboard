 "use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./page.module.css";
import { supabase } from "../lib/supabaseClient";

type Item = {
  id: string;
  text: string;
  created_at: string | null;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const trimmed = input.trim();
  const canSave = trimmed.length > 0;

  async function loadItems() {
    setErrorMsg(null);
    if (!supabase) {
      setErrorMsg("Supabase is not configured. Set web/.env.local values.");
      setItems([]);
      return;
    }

    const { data, error } = await supabase
      .from("message_items")
      .select("id, text, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setItems((data ?? []) as Item[]);
  }

  useEffect(() => {
    loadItems().catch((err) => {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to load items."
      );
    });
  }, []);

  async function onSave() {
    if (!canSave || saving) return;
    setSaving(true);
    setErrorMsg(null);

    try {
      if (!supabase) {
        setErrorMsg("Supabase is not configured. Set web/.env.local values.");
        return;
      }

      const trimmedNow = input.trim();
      if (!trimmedNow) return;

      const { error: insertError } = await supabase
        .from("message_items")
        .insert({ text: trimmedNow });

      if (insertError) throw insertError;

      // Clear input only after a successful save.
      setInput("");
      await loadItems();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save item.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!supabase) {
      setErrorMsg("Supabase is not configured. Set web/.env.local values.");
      return;
    }

    setErrorMsg(null);
    setDeletingId(id);

    try {
      const { error: deleteError } = await supabase
        .from("message_items")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await loadItems();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete item.");
    } finally {
      setDeletingId(null);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave();
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Message Board</h1>

        <form className={styles.form} onSubmit={onSubmit}>
          <input
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something..."
            aria-label="New item"
          />
          <button className={styles.button} type="submit" disabled={!canSave || saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </form>

        <ul className={styles.list} aria-label="Saved items">
          {items.length === 0 ? (
            <li className={styles.empty}>No items yet.</li>
          ) : (
            items.map((item) => (
              <li className={styles.listItem} key={item.id}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ flex: 1 }}>{item.text}</div>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    disabled={deletingId === item.id}
                    className={styles.button}
                    style={{ height: 32, padding: "0 10px" }}
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {errorMsg ? (
          <p
            style={{
              marginTop: 12,
              color: "#b00020",
              fontSize: 14,
            }}
            role="alert"
          >
            {errorMsg}
          </p>
        ) : null}
      </main>
    </div>
  );
}
