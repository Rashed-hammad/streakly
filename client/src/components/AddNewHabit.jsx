import React from "react";

const AddNewHabit = ({
  showModal,
  setShowModal,
  newHabit,
  setNewHabit,
  handleAddHabit,
}) => {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* Modal Card */}
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
            {/* Title */}
            <h2 className="text-xl font-bold text-text">New Habit</h2>

            <p className="mt-1 text-sm text-muted">
              Build consistency one habit at a time
            </p>

            {/* Inputs */}
            <div className="mt-5 flex flex-col gap-4">
              <input
                type="text"
                placeholder="Habit name"
                value={newHabit.title}
                onChange={(e) =>
                  setNewHabit({ ...newHabit, title: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              <input
                type="text"
                placeholder="Description (optional)"
                value={newHabit.description}
                onChange={(e) =>
                  setNewHabit({
                    ...newHabit,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-text transition hover:opacity-80"
              >
                Cancel
              </button>

              <button
                onClick={handleAddHabit}
                className="rounded-xl bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNewHabit;
