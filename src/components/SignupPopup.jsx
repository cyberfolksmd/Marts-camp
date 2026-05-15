import { useState } from "react";

export default function SignupPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Кнопка открытия (можешь убрать если открывается из футера) */}
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-yellow-600 text-black font-bold rounded-xl hover:bg-yellow-500 transition"
      >
        Записаться
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="w-[420px] bg-[#0b0b0b] border border-yellow-600 rounded-2xl p-6 relative shadow-2xl pirate-glow">

            {/* закрыть */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-yellow-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">
              🏴 Запись в пиратский лагерь
            </h2>

            <p className="text-gray-400 text-sm text-center mb-6">
              Вступи в команду и отправься в приключение
            </p>

            <form className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Имя"
                className="p-3 rounded-lg bg-black border border-yellow-700 text-white"
              />

              <input
                type="tel"
                placeholder="Телефон"
                className="p-3 rounded-lg bg-black border border-yellow-700 text-white"
              />

              <button
                type="submit"
                className="mt-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}