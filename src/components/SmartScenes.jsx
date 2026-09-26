import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

const initialScenes = [
  {
    id: "morning",
    name: "Morning routine",
    description: "Open curtains, warm the kitchen, and set lights to 40%.",
    schedule: "Weekdays · 7:00 AM",
    color: "bg-[#d8c5a8]",
    status: "Scheduled",
  },
  {
    id: "evening",
    name: "Evening at home",
    description: "Set warm lighting, close curtains, and play ambient audio.",
    schedule: "Daily · 7:30 PM",
    color: "bg-[#c5b9aa]",
    status: "Ready",
  },
  {
    id: "away",
    name: "Away mode",
    description: "Turn off devices, lock access points, and arm monitoring.",
    schedule: "Manual activation",
    color: "bg-[#b9c4ac]",
    status: "Ready",
  },
  {
    id: "sleep",
    name: "Sleep mode",
    description: "Dim hallway lighting, cool the bedroom, and secure the home.",
    schedule: "Daily · 11:00 PM",
    color: "bg-[#aeb9c4]",
    status: "Scheduled",
  },
];

const colorOptions = [
  { label: "Sage green", value: "bg-[#b9c4ac]" },
  { label: "Warm sand", value: "bg-[#d8c5a8]" },
  { label: "Stone gray", value: "bg-[#c5b9aa]" },
  { label: "Slate blue", value: "bg-[#aeb9c4]" },
  { label: "Soft mint", value: "bg-[#c2d0ca]" },
];

export default function SmartScenes() {
  const [sceneList, setSceneList] = useState(initialScenes);
  const [activeSceneId, setActiveSceneId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState(null);
  const [deletingSceneId, setDeletingSceneId] = useState(null);

  const [newScene, setNewScene] = useState({
    name: "",
    description: "",
    schedule: "",
    color: "bg-[#b9c4ac]",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    schedule: "",
    color: "bg-[#b9c4ac]",
  });

  const activateScene = (sceneId) => {
    setActiveSceneId((currentSceneId) =>
      currentSceneId === sceneId ? null : sceneId,
    );
  };

  const handleCreateScene = (e) => {
    e.preventDefault();
    if (!newScene.name.trim()) return;

    const createdScene = {
      id: `custom-${Date.now()}`,
      name: newScene.name.trim(),
      description: newScene.description.trim(),
      schedule: newScene.schedule.trim() || "Manual activation",
      color: newScene.color,
      status: "Ready",
      isCustom: true,
    };

    setSceneList((prev) => [...prev, createdScene]);
    setNewScene({
      name: "",
      description: "",
      schedule: "",
      color: "bg-[#b9c4ac]",
    });
    setIsCreating(false);
  };

  const startEditing = (scene) => {
    setEditingSceneId(scene.id);
    setDeletingSceneId(null);
    setEditForm({
      name: scene.name,
      description: scene.description,
      schedule: scene.schedule,
      color: scene.color,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;

    setSceneList((prev) =>
      prev.map((scene) =>
        scene.id === editingSceneId
          ? {
              ...scene,
              name: editForm.name.trim(),
              description: editForm.description.trim(),
              schedule: editForm.schedule.trim() || "Manual activation",
              color: editForm.color,
            }
          : scene,
      ),
    );
    setEditingSceneId(null);
  };

  const confirmDelete = (sceneId) => {
    setSceneList((prev) => prev.filter((scene) => scene.id !== sceneId));
    if (activeSceneId === sceneId) {
      setActiveSceneId(null);
    }
    setDeletingSceneId(null);
  };

  const activeScene = sceneList.find((scene) => scene.id === activeSceneId);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
            Home automations
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Smart scenes
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsCreating((prev) => !prev);
              setEditingSceneId(null);
              setDeletingSceneId(null);
            }}
            className="flex items-center gap-2 border border-stone-700 bg-stone-800 px-3 py-2 text-sm font-semibold text-stone-50 transition-colors duration-200 hover:bg-stone-700 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
          >
            {isCreating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isCreating ? "Cancel" : "New scene"}
          </button>

          {activeScene ? (
            <p className="border border-emerald-800/25 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950 dark:text-emerald-400">
              {activeScene.name} is active
            </p>
          ) : (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No scene is currently active
            </p>
          )}
        </div>
      </div>

      {isCreating && (
        <form
          onSubmit={handleCreateScene}
          className="mt-7 border border-stone-400 bg-[#f5f1e8] p-5 shadow-sm dark:border-stone-600 dark:bg-[#231f1c]"
        >
          <div className="flex items-center justify-between border-b border-stone-300 pb-3 dark:border-stone-700">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-600 dark:text-stone-300">
              Create custom scene
            </p>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400">
                Scene name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Focus work"
                value={newScene.name}
                onChange={(e) =>
                  setNewScene({ ...newScene, name: e.target.value })
                }
                className="mt-1.5 w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-600 focus:outline-none dark:border-stone-700 dark:bg-[#1c1917] dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400">
                Schedule / trigger
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Weekdays · 2:00 PM or Manual"
                value={newScene.schedule}
                onChange={(e) =>
                  setNewScene({ ...newScene, schedule: e.target.value })
                }
                className="mt-1.5 w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-600 focus:outline-none dark:border-stone-700 dark:bg-[#1c1917] dark:text-stone-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400">
                Description & automated actions
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dim office lights to 50%, mute notifications, set climate to 21°C."
                value={newScene.description}
                onChange={(e) =>
                  setNewScene({ ...newScene, description: e.target.value })
                }
                className="mt-1.5 w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-600 focus:outline-none dark:border-stone-700 dark:bg-[#1c1917] dark:text-stone-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400">
                Theme color
              </label>
              <div className="mt-2 flex gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setNewScene({ ...newScene, color: c.value })}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${c.value} ${
                      newScene.color === c.value
                        ? "border-stone-900 ring-2 ring-stone-700 ring-offset-2 dark:border-stone-100 dark:ring-stone-400 dark:ring-offset-[#231f1c]"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                    title={c.label}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3 border-t border-stone-300 pt-4 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="border border-stone-400 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border border-stone-700 bg-stone-800 px-4 py-2 text-sm font-semibold text-stone-50 transition-colors duration-200 hover:bg-stone-700 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
            >
              Save scene
            </button>
          </div>
        </form>
      )}

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {sceneList.map((scene) => {
          const isActive = activeSceneId === scene.id;
          const isEditing = editingSceneId === scene.id;
          const isDeleting = deletingSceneId === scene.id;

          if (isEditing) {
            return (
              <form
                key={scene.id}
                onSubmit={handleSaveEdit}
                className="border border-stone-500 bg-[#f5f1e8] p-5 shadow-sm dark:border-stone-600 dark:bg-[#231f1c]"
              >
                <div className="flex items-center justify-between border-b border-stone-300 pb-3 dark:border-stone-700">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-600 dark:text-stone-300">
                    Edit scene
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditingSceneId(null)}
                    className="text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                      Scene name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="mt-1 w-full border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-900 focus:border-stone-600 focus:outline-none dark:border-stone-700 dark:bg-[#1c1917] dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                      Schedule
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.schedule}
                      onChange={(e) =>
                        setEditForm({ ...editForm, schedule: e.target.value })
                      }
                      className="mt-1 w-full border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-900 focus:border-stone-600 focus:outline-none dark:border-stone-700 dark:bg-[#1c1917] dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 w-full resize-none border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-900 focus:border-stone-600 focus:outline-none dark:border-stone-700 dark:bg-[#1c1917] dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                      Theme color
                    </label>
                    <div className="mt-1.5 flex gap-2.5">
                      {colorOptions.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() =>
                            setEditForm({ ...editForm, color: c.value })
                          }
                          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${c.value} ${
                            editForm.color === c.value
                              ? "border-stone-900 ring-2 ring-stone-700 ring-offset-2 dark:border-stone-100 dark:ring-stone-400 dark:ring-offset-[#231f1c]"
                              : "border-transparent opacity-75 hover:opacity-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2 border-t border-stone-300 pt-3 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setEditingSceneId(null)}
                    className="border border-stone-400 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 border border-stone-700 bg-stone-800 px-3 py-1 text-xs font-semibold text-stone-50 hover:bg-stone-700 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Save
                  </button>
                </div>
              </form>
            );
          }

          return (
            <article
              key={scene.id}
              className={`relative border p-5 transition-all duration-300 ${
                isActive
                  ? "border-stone-700 bg-[#ebe5d9] dark:border-stone-500 dark:bg-[#3a3530]"
                  : "border-stone-300 bg-[#f7f4ed] hover:-translate-y-0.5 hover:border-stone-400 dark:border-stone-700 dark:bg-[#292524] dark:hover:border-stone-600"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${scene.color}`}
                  aria-hidden="true"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(scene)}
                    className="text-stone-400 transition-colors hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200"
                    aria-label={`Edit ${scene.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingSceneId(scene.id)}
                    className="text-stone-400 transition-colors hover:text-red-700 dark:text-stone-500 dark:hover:text-red-400"
                    aria-label={`Delete ${scene.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <span
                    className={`ml-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                      isActive
                        ? "text-emerald-800 dark:text-emerald-400"
                        : "text-stone-500 dark:text-stone-400"
                    }`}
                  >
                    {isActive ? "Active" : scene.status}
                  </span>
                </div>
              </div>

              {isDeleting && (
                <div className="mt-4 border border-red-300 bg-red-50 p-3 dark:border-red-800/60 dark:bg-red-950/40">
                  <p className="text-xs font-medium text-red-900 dark:text-red-200">
                    Delete &ldquo;{scene.name}&rdquo;?
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => confirmDelete(scene.id)}
                      className="border border-red-800 bg-red-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700"
                    >
                      Confirm delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingSceneId(null)}
                      className="border border-stone-300 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <h3 className="mt-7 text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                {scene.name}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-stone-600 dark:text-stone-400">
                {scene.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-300 pt-4 dark:border-stone-700">
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  {scene.schedule}
                </p>

                <button
                  type="button"
                  onClick={() => activateScene(scene.id)}
                  className={`border px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "border-stone-700 bg-stone-800 text-stone-50 hover:bg-stone-700 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
                      : "border-stone-400 text-stone-800 hover:bg-stone-200 dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-700"
                  }`}
                >
                  {isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}