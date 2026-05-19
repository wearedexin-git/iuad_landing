import { useState, useEffect, useMemo } from "react";
import { LampIcon } from "./LampIcon";
import svgPaths from "../../imports/svg-ffe0txzxzn";
import { 
  sanitizeInput, 
  getValidationError 
} from "../utils/validation";
import { preloadThankYouPage, trackFormEvent } from "../utils/preload";
import openDayConfig from "../config/openday-config.json";

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
      className={`relative w-6 h-6 rounded shrink-0 border cursor-pointer transition-colors ${
        checked ? "bg-white border-white" : "bg-transparent border-[#ddd]"
      }`}
    >
      {checked && (
        <svg
          className="absolute inset-0 m-auto w-3.5 h-3.5 block"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 12.5L10 16L18 8"
            stroke="#719E85"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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

type Session = {
  id: string;
  apiDateTime: string;
};

type Campus = {
  id: string;
  label: string;
  apiValue: string;
  address?: string;
  mode?: "onsite" | "online";
  sessions?: Session[];
};

/** Solo sedi con almeno una data Open Day (sessions valorizzato e non vuoto) */
const CAMPUSES = (openDayConfig.campuses as Campus[]).filter(
  (campus) => Array.isArray(campus.sessions) && campus.sessions.length > 0,
);

const IS_SINGLE_CAMPUS = CAMPUSES.length === 1;
const SINGLE_CAMPUS = IS_SINGLE_CAMPUS ? CAMPUSES[0] : undefined;
const SINGLE_CAMPUS_SESSIONS = SINGLE_CAMPUS?.sessions ?? [];
/** Una sede e più date: serve solo il select data (niente select sede) */
const SHOW_DATE_ONLY_FOR_SINGLE_CAMPUS =
  IS_SINGLE_CAMPUS && SINGLE_CAMPUS_SESSIONS.length > 1;
/** Più sedi: select sede + data come prima */
const SHOW_SEDE_AND_DATE_ROW = CAMPUSES.length > 1;

function initialHeroFormState() {
  const single = CAMPUSES.length === 1 ? CAMPUSES[0] : null;
  const sessions = single?.sessions ?? [];
  return {
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    comeConosciuto: "",
    campusId: single ? single.id : "",
    openDayDate: sessions.length === 1 ? sessions[0].apiDateTime : "",
  };
}

/** Testo corpo hero (intro + via/date sedi): stessa scala tipografica su tutti i breakpoint */
const HERO_BODY_COPY_CLASS =
  "font-sarabun font-light text-[length:calc(20px-2pt)] md:text-[length:calc(24px-2pt)] xl:text-[length:calc(28px-2pt)] text-[#201f1f] leading-[1.3]";

function formatItalianDateTime(value: string) {
  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(parsed)
    .replace(/\s+alle\s+(?:ore\s+)?/i, ", ore ");
}

function getCampusDisplayLocation(campus: Campus) {
  if (campus.mode === "online") {
    return "Online, in inglese";
  }

  const normalizedAddress = (campus.address ?? "").trim().toLowerCase();
  if (normalizedAddress === "online") {
    return "Online, in inglese";
  }

  return campus.address;
}

export function HeroSection({ onBookClick: _onBookClick }: { onBookClick: () => void }) {
  const [formData, setFormData] = useState(initialHeroFormState);
  const [privacy, setPrivacy] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const selectedCampus = useMemo(
    () => CAMPUSES.find((campus) => campus.id === formData.campusId),
    [formData.campusId],
  );

  const availableSessions = selectedCampus?.sessions ?? [];

  // Preload pagina di ringraziamento quando l'utente inizia a compilare
  useEffect(() => {
    if (hasInteracted) {
      preloadThankYouPage();
      trackFormEvent('FormStarted');
    }
  }, [hasInteracted]);

  // Pre-seleziona la data se la sede scelta ha una sola sessione
  useEffect(() => {
    if (availableSessions.length === 1) {
      const onlySession = availableSessions[0].apiDateTime;
      if (formData.openDayDate !== onlySession) {
        setFormData((prev) => ({ ...prev, openDayDate: onlySession }));
      }
      return;
    }

    if (formData.openDayDate !== "" && !availableSessions.some((session) => session.apiDateTime === formData.openDayDate)) {
      setFormData((prev) => ({ ...prev, openDayDate: "" }));
    }
  }, [availableSessions, formData.openDayDate]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errori
    setErrorMsg("");
    
    // Validazione privacy
    if (!privacy) {
      setErrorMsg("Devi accettare l'informativa sulla privacy per procedere.");
      return;
    }

    // Validazione campi con messaggi dettagliati
    const nomeError = getValidationError('nome', formData.nome);
    if (nomeError) {
      setErrorMsg(nomeError);
      return;
    }

    const cognomeError = getValidationError('cognome', formData.cognome);
    if (cognomeError) {
      setErrorMsg(cognomeError);
      return;
    }

    const emailError = getValidationError('email', formData.email);
    if (emailError) {
      setErrorMsg(emailError);
      return;
    }

    const telefonoError = getValidationError('telefono', formData.telefono);
    if (telefonoError) {
      setErrorMsg(telefonoError);
      return;
    }

    // Verifica che sia selezionata un'opzione valida per "come ci hai conosciuto"
    if (!formData.comeConosciuto || formData.comeConosciuto === "") {
      setErrorMsg("Seleziona come ci hai conosciuto.");
      return;
    }

    if (!formData.campusId || !selectedCampus) {
      setErrorMsg("Seleziona la sede.");
      return;
    }

    if (!formData.openDayDate) {
      setErrorMsg("Seleziona la data.");
      return;
    }

    setStatus("loading");
    trackFormEvent("FormSubmitted", {
      campus: selectedCampus.apiValue,
      open_day_date: formData.openDayDate,
    });

    const base = import.meta.env.BASE_URL;
    try {
      const res = await fetch(`${base}submit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name:    sanitizeInput(formData.nome),
          last_name:     sanitizeInput(formData.cognome),
          email:         sanitizeInput(formData.email),
          phone_number:  sanitizeInput(formData.telefono),
          how_you_knows: formData.comeConosciuto,
          location:      selectedCampus.apiValue,
          open_day_date: formData.openDayDate,
        }),
      });

      const raw = await res.text();
      let data: { success?: boolean; message?: string; redirect?: string };
      try {
        data = JSON.parse(raw) as typeof data;
      } catch {
        trackFormEvent("FormError", {
          error: "Invalid JSON from submit.php",
          campus: selectedCampus.apiValue,
          open_day_date: formData.openDayDate,
        });
        setStatus("error");
        setErrorMsg(
          import.meta.env.DEV
            ? "Il server PHP non risponde o non restituisce JSON. Avvia in un altro terminale, dalla cartella public: php -S localhost:8888 (stessa porta del proxy in vite.config.ts), poi riprova l’invio."
            : "Risposta non valida dal server. Controlla i log PHP e riprova.",
        );
        return;
      }

      if (data.success) {
        trackFormEvent("FormSuccess", {
          campus: selectedCampus.apiValue,
          open_day_date: formData.openDayDate,
        });
        const redirectPath = (data.redirect ?? "grazie.html").replace(/^\//, "");
        window.location.href = base + redirectPath;
      } else {
        trackFormEvent("FormError", {
          error: data.message,
          campus: selectedCampus.apiValue,
          open_day_date: formData.openDayDate,
        });
        setStatus("error");
        setErrorMsg(data.message ?? "Si è verificato un errore. Riprova.");
      }
    } catch {
      trackFormEvent("FormError", {
        error: "Network error",
        campus: selectedCampus.apiValue,
        open_day_date: formData.openDayDate,
      });
      setStatus("error");
      setErrorMsg(
        import.meta.env.DEV
          ? "Richiesta non riuscita. Verifica che PHP sia avviato su localhost:8888 (vedi messaggio sopra) e che il proxy in vite.config.ts punti alla porta corretta."
          : "Impossibile contattare il server. Controlla la connessione e riprova.",
      );
    }
  };

  return (
    <section
      id="form-section"
      className="relative z-10 bg-[#D2E8DB] min-h-[700px] xl:min-h-[765px]"
    >
      {/* Layout principale: due colonne centrate */}
      <div className="relative z-10 flex flex-col xl:flex-row gap-6 xl:gap-12 items-start justify-center px-4 md:px-8 xl:px-0 pt-10 pb-16 xl:py-0 xl:absolute xl:left-1/2 xl:-translate-x-1/2 xl:top-[calc(50%-53px)] xl:-translate-y-1/2 w-full xl:w-auto">

        {/* Colonna sinistra: testo */}
        <div className="flex flex-col gap-[52px] items-start w-full xl:w-[588px]">
          <div className="flex flex-col gap-6 items-start w-full">
            <h1 className="font-tiempos text-[length:calc(48px-2pt)] md:text-[length:calc(64px-2pt)] xl:text-[length:calc(80px-2pt)] text-[#719E85] leading-[1.04]">
              Design e Architettura<br />degli Interni
            </h1>

            <div className="flex flex-col gap-4 items-start w-full">
              <p className={HERO_BODY_COPY_CLASS}>
                Vieni a scoprire il nostro{" "}
                <span className="font-bold">Corso Triennale di I Livello</span>, parla
                con gli <span className="font-bold">studenti</span> e conosci i
                nostri <span className="font-bold">professionisti.</span>
              </p>

              <div className="flex flex-col gap-6">
                {CAMPUSES.length === 0 ? (
                  <p className={HERO_BODY_COPY_CLASS}>
                    Non risultano sedi con date Open Day attive. In{" "}
                    <span className="font-bold">openday-config.json</span> serve almeno una voce in{" "}
                    <span className="font-bold">campuses</span> con{" "}
                    <span className="font-bold">sessions</span> contenente almeno una data.
                  </p>
                ) : (
                  CAMPUSES.map((campus) => (
                    <div key={campus.id} className="flex flex-col gap-2">
                      <span className="font-tiempos text-[#719E85] text-[length:calc(20px-2pt)] md:text-[length:calc(28px-2pt)] leading-[1]">
                        {campus.label}
                      </span>
                      <span className={HERO_BODY_COPY_CLASS}>
                        {getCampusDisplayLocation(campus)}
                      </span>
                      <div className={HERO_BODY_COPY_CLASS}>
                        {(campus.sessions ?? []).map((session) => (
                          <p key={session.id}>{formatItalianDateTime(session.apiDateTime)}</p>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Colonna destra: form card arancio + icona mobile */}
        <div className="relative w-full xl:w-[585px]">

          {/* Icona lampadina mobile — a cavallo del bordo superiore della card */}
          <div className="block xl:hidden absolute -top-[60px] right-0 w-[120px] h-[120px] z-20">
            <div className="w-full h-full rotate-[-5.27deg] flex items-center justify-center">
              <LampIcon variant="large" withShadow className="w-[110px] h-[110px]" />
            </div>
          </div>

        <div className="bg-[#719E85] rounded-[24px] p-6 flex flex-col gap-3 w-full">
          <h2 className="font-tiempos text-[length:calc(40px-2pt)] md:text-[length:calc(52px-2pt)] xl:text-[length:calc(60px-2pt)] text-[#D2E8DB] leading-[1]">
            Registrati
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">

              {/* Row 1: Nome, Cognome */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-[4px]">
                  <label className="font-sarabun font-medium text-[#D2E8DB] text-[length:calc(18px-2pt)] leading-[2.5]">
                    Nome*
                  </label>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[length:calc(14px-2pt)] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col gap-[4px]">
                  <label className="font-sarabun font-medium text-[#D2E8DB] text-[length:calc(18px-2pt)] leading-[2.5]">
                    Cognome*
                  </label>
                  <input
                    type="text"
                    placeholder="Cognome"
                    value={formData.cognome}
                    onChange={(e) => handleInputChange('cognome', e.target.value)}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[length:calc(14px-2pt)] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email, Telefono */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-[4px]">
                  <label className="font-sarabun font-medium text-[#D2E8DB] text-[length:calc(18px-2pt)] leading-[2.5]">
                    Email*
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[length:calc(14px-2pt)] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col gap-[4px]">
                  <label className="font-sarabun font-medium text-[#D2E8DB] text-[length:calc(18px-2pt)] leading-[2.5]">
                    Telefono*
                  </label>
                  <input
                    type="tel"
                    placeholder="Telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[length:calc(14px-2pt)] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Sede + Data: solo se ci sono più sedi; una sede + più date: solo Data */}
              {SHOW_SEDE_AND_DATE_ROW && (
                <div className="flex flex-col gap-4 md:flex-row md:gap-4">
                  <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                    <label className="font-sarabun font-medium text-[#D2E8DB] text-[length:calc(18px-2pt)] leading-[2.5]">
                      Sede *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.campusId}
                        onChange={(e) => handleInputChange("campusId", e.target.value)}
                        className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[length:calc(14px-2pt)] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all w-full appearance-none pr-10"
                        required
                      >
                        <option value="">Seleziona la sede</option>
                        {CAMPUSES.map((campus) => (
                          <option key={campus.id} value={campus.id}>
                            {campus.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ArrowDownIcon />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                    <label className="font-sarabun font-medium text-[#D2E8DB] text-[length:calc(18px-2pt)] leading-[2.5]">
                      Data *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.openDayDate}
                        onChange={(e) => handleInputChange("openDayDate", e.target.value)}
                        className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[length:calc(14px-2pt)] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all w-full appearance-none pr-10 disabled:opacity-70"
                        required
                        disabled={availableSessions.length === 0}
                      >
                        <option value="">Seleziona Giorno</option>
                        {availableSessions.map((session) => (
                          <option key={session.id} value={session.apiDateTime}>
                            {formatItalianDateTime(session.apiDateTime)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ArrowDownIcon />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {SHOW_DATE_ONLY_FOR_SINGLE_CAMPUS && (
                <div className="flex flex-col gap-[4px]">
                  <label className="font-sarabun font-medium text-[#D2E8DB] text-[length:calc(18px-2pt)] leading-[2.5]">
                    Data *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.openDayDate}
                      onChange={(e) => handleInputChange("openDayDate", e.target.value)}
                      className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[length:calc(14px-2pt)] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all w-full appearance-none pr-10"
                      required
                    >
                      <option value="">Seleziona Giorno</option>
                      {SINGLE_CAMPUS_SESSIONS.map((session) => (
                        <option key={session.id} value={session.apiDateTime}>
                          {formatItalianDateTime(session.apiDateTime)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ArrowDownIcon />
                    </div>
                  </div>
                </div>
              )}

              {/* Row: Come ci hai conosciuto */}
              <div className="flex flex-col gap-[4px]">
                <label className="font-sarabun font-medium text-[#D2E8DB] text-[length:calc(18px-2pt)] leading-[2.5]">
                  Come ci hai conosciuto? *
                </label>
                <div className="relative">
                  <select
                    value={formData.comeConosciuto}
                    onChange={(e) => handleInputChange('comeConosciuto', e.target.value)}
                    className="bg-[#fbfbfb] border border-white rounded-full px-4 py-3 font-sarabun font-light text-[length:calc(14px-2pt)] text-[#444] outline-none focus:ring-2 focus:ring-white/50 transition-all w-full appearance-none pr-10"
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
              <p className="font-sarabun font-light text-[#201f1f] text-[length:calc(13px-2pt)] md:text-[length:calc(14px-2pt)] leading-[1.5]">
                Dichiaro di aver letto l'informativa ex. Art. 13 del GDPR 679/16 e acconsento al
                trattamento dei miei dati per ricevere informazioni sulle iniziative via E-Mail e
                contatto telefonico.
              </p>
            </div>

            {errorMsg && (
              <p className="font-sarabun text-[length:calc(13px-2pt)] text-white leading-[1.5] -mt-2">
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
              <span className="font-tiempos text-[length:calc(18px-2pt)] md:text-[length:calc(20px-2pt)] text-[#719E85] whitespace-nowrap leading-none">
                {status === "loading" ? "Invio in corso…" : "Invia la tua richiesta"}
              </span>
            </button>
          </form>
        </div>
        </div> {/* fine wrapper relativo colonna destra */}
      </div>

      {/* Icona lampadina: bottom-right, ruotata — solo desktop wide */}
      <div className="hidden xl:block absolute bottom-[-160px] right-[-57px] w-[459px] h-[459px] z-20">
        <div className="w-full h-full rotate-[-6.67deg] flex items-center justify-center">
          <LampIcon
            variant="large"
            withShadow
            className="w-[255px] h-[255px]"
          />
        </div>
      </div>
    </section>
  );
}
