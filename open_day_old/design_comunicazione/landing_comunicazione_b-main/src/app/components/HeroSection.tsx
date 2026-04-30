import { useState } from "react";
import { EyeIcon } from "./EyeIcon";
import svgPaths from "../../imports/svg-ffe0txzxzn";

function ArrowDownIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16">
      <path
        d={svgPaths.p1f6a8100}
        stroke="#201F1F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

function CheckboxIcon({ checked }: { checked: boolean }) {
  return (
    <div
      className={`w-6 h-6 rounded shrink-0 border flex items-center justify-center cursor-pointer transition-colors ${
        checked ? "bg-white border-white" : "bg-transparent border-[#ddd]"
      }`}
    >
      {checked && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d={svgPaths.pb0709b2} fill="#d06321" />
        </svg>
      )}
    </div>
  );
}

const HOW_YOU_KNOWS_OPTIONS = [
  { label: "Come ci hai conosciuto", value: "" },
  { label: "Social Media",          value: "6" },
  { label: "Amici / Passaparola",   value: "1" },
  { label: "Ricerca Google",        value: "3" },
  { label: "Fiere / Orientamento",  value: "4" },
  { label: "Pubblicità",            value: "2" },
  { label: "Scuola / Orientamento", value: "5" },
  { label: "Altro",                 value: "7" },
];

type FormStatus = "idle" | "loading" | "error";

export function HeroSection({ onBookClick: _onBookClick }: { onBookClick: () => void }) {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    comeConosciuto: "",
  });
  const [privacy, setPrivacy] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacy) {
      setErrorMsg("Devi accettare l'informativa sulla privacy per procedere.");
      return;
    }
    setErrorMsg("");
    setStatus("loading");

    const base = import.meta.env.BASE_URL;
    try {
      const res = await fetch(`${base}submit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name:    formData.nome,
          last_name:     formData.cognome,
          email:         formData.email,
          phone_number:  formData.telefono,
          how_you_knows: formData.comeConosciuto,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const redirectPath = (data.redirect ?? "grazie.html").replace(/^\//, "");
        window.location.href = base + redirectPath;
      } else {
        setStatus("error");
        setErrorMsg(data.message ?? "Si è verificato un errore. Riprova.");
      }
    } catch (err) {
      setStatus("error");
      if (err instanceof SyntaxError) {
        setErrorMsg("Risposta non valida dal server. Controlla i log PHP e riprova.");
      } else {
        setErrorMsg("Impossibile contattare il server. Controlla la connessione e riprova.");
      }
    }
  };

  return (
    <section
      id="form-section"
      className="relative z-10 bg-[#f4dbcc] min-h-[700px] xl:min-h-[765px]"
    >
      {/* Layout principale: due colonne centrate */}
      <div className="relative z-10 flex flex-col xl:flex-row gap-6 xl:gap-12 items-start justify-center px-4 md:px-8 xl:px-0 pt-10 pb-16 xl:py-0 xl:absolute xl:left-1/2 xl:-translate-x-1/2 xl:top-[calc(50%-53px)] xl:-translate-y-1/2 w-full xl:w-auto">

        {/* Colonna sinistra: testo */}
        <div className="flex flex-col gap-[52px] items-start w-full xl:w-[588px]">
          <div className="flex flex-col gap-6 items-start w-full">
            <h1 className="font-tiempos text-[48px] md:text-[64px] xl:text-[80px] text-[#d06321] leading-[1.04]">
              Design della<br />Comunicazione
            </h1>

            <div className="flex flex-col gap-4 items-start w-full">
              <p className="font-sarabun font-light text-[20px] md:text-[24px] xl:text-[28px] text-[#201f1f] leading-[1.3]">
                Vieni a scoprire il nostro{" "}
                <span className="font-bold">Corso Triennale di I Livello</span>, parla
                con gli <span className="font-bold">studenti</span> e conosci i
                nostri <span className="font-bold">professionisti.</span>
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="font-tiempos text-[#d06321] text-[20px] md:text-[28px] leading-[1]">
                    Quando
                  </span>
                  <span className="font-sarabun font-light text-[#201f1f] text-[18px] md:text-[24px] leading-[1]">
                    16 Maggio 2026, h 11.00
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-tiempos text-[#d06321] text-[20px] md:text-[28px] leading-[1]">
                    Dove
                  </span>
                  <span className="font-sarabun font-light text-[#201f1f] text-[18px] md:text-[24px] leading-[1]">
                    Via Balduccio da Pisa 16, Milano
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonna destra: form card arancio + icona mobile */}
        <div className="relative w-full xl:w-[585px]">

          {/* Icona occhio mobile — a cavallo del bordo superiore della card */}
          <div className="block xl:hidden absolute -top-[60px] right-0 w-[120px] h-[120px] z-20">
            <div className="w-full h-full rotate-[-5.27deg] flex items-center justify-center">
              <EyeIcon variant="large" className="w-[110px] h-[68px]" />
            </div>
          </div>

        <div className="bg-[#d06321] rounded-[24px] p-6 flex flex-col gap-3 w-full">
          <h2 className="font-tiempos text-[40px] md:text-[52px] xl:text-[60px] text-[#f4dbcc] leading-[1]">
            Registrati
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">

              {/* Row 1: Nome, Cognome */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="font-sarabun font-medium text-[#f4dbcc] text-[18px] leading-[2.5]">
                    Nome*
                  </label>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[14px] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="font-sarabun font-medium text-[#f4dbcc] text-[18px] leading-[2.5]">
                    Cognome*
                  </label>
                  <input
                    type="text"
                    placeholder="Cognome"
                    value={formData.cognome}
                    onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[14px] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email, Telefono */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="font-sarabun font-medium text-[#f4dbcc] text-[18px] leading-[2.5]">
                    Email*
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[14px] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="font-sarabun font-medium text-[#f4dbcc] text-[18px] leading-[2.5]">
                    Telefono*
                  </label>
                  <input
                    type="tel"
                    placeholder="Telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[14px] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Come ci hai conosciuto */}
              <div className="flex flex-col gap-2">
                <label className="font-sarabun font-medium text-[#f4dbcc] text-[18px] leading-[2.5]">
                  Come ci hai conosciuto? *
                </label>
                <div className="relative">
                  <select
                    value={formData.comeConosciuto}
                    onChange={(e) => setFormData({ ...formData, comeConosciuto: e.target.value })}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[14px] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all w-full appearance-none pr-10"
                    required
                  >
                    {HOW_YOU_KNOWS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ArrowDownIcon />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy checkbox */}
            <div className="flex gap-3 items-start">
              <div onClick={() => setPrivacy(!privacy)} className="mt-0.5 cursor-pointer">
                <CheckboxIcon checked={privacy} />
              </div>
              <p className="font-sarabun font-light text-[#201f1f] text-[13px] md:text-[14px] leading-[1.5]">
                Dichiaro di aver letto l'informativa ex. Art. 13 del GDPR 679/16 e acconsento al
                trattamento dei miei dati per ricevere informazioni sulle iniziative via E-Mail e
                contatto telefonico.
              </p>
            </div>

            {errorMsg && (
              <p className="font-sarabun text-[13px] text-white leading-[1.5] -mt-2">
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={`bg-white flex items-center justify-center px-6 py-4 rounded-full self-start transition-all ${
                status === "loading"
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:opacity-90 active:scale-[0.98]"
              }`}
            >
              <span className="font-tiempos text-[18px] md:text-[20px] text-[#d06321] whitespace-nowrap leading-none">
                {status === "loading" ? "Invio in corso…" : "Invia la tua richiesta"}
              </span>
            </button>
          </form>
        </div>
        </div> {/* fine wrapper relativo colonna destra */}
      </div>

      {/* Icona occhio: bottom-right, ruotata — solo desktop wide */}
      <div className="hidden xl:block absolute bottom-[-160px] right-[-57px] w-[459px] h-[459px] z-20">
        <div className="w-full h-full rotate-[-6.67deg] flex items-center justify-center">
          <EyeIcon
            variant="large"
            className="w-[411px] h-[255px]"
          />
        </div>
      </div>
    </section>
  );
}
