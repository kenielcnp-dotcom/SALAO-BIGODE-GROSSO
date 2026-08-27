"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { Professional, Service } from "@/lib/data/types";
import { formatMoney } from "@/lib/data/types";
import { createBooking, getAvailableSlots } from "@/lib/actions/booking";

const STEP_LABELS = ["Serviço", "Profissional", "Data", "Dados", "Revisão"];
const WEEKDAY_HEADERS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isPast(d: Date, today: Date) {
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return a < b;
}

export function BookingWizard({
  services,
  professionals,
  initialServiceId,
  initialProfessionalId,
}: {
  services: Service[];
  professionals: Professional[];
  initialServiceId: string | null;
  initialProfessionalId: string | null;
}) {
  const today = useMemo(() => new Date(), []);

  const [step, setStep] = useState(
    initialServiceId ? (initialProfessionalId ? 3 : 2) : 1,
  );
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [professionalId, setProfessionalId] = useState(initialProfessionalId);
  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, startSlotsTransition] = useTransition();
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, startSubmitTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  const service = services.find((s) => s.id === serviceId) ?? null;
  const professional = professionals.find((p) => p.id === professionalId) ?? null;

  function selectService(id: string) {
    setServiceId(id);
  }

  function selectProfessional(id: string) {
    setProfessionalId(id);
  }

  function pickDate(d: Date) {
    if (isPast(d, today) || !professionalId || !service) return;
    const key = toDateKey(d);
    setDate(key);
    setTime(null);
    setSlots([]);
    setSlotsError(null);
    startSlotsTransition(async () => {
      try {
        const result = await getAvailableSlots(
          professionalId,
          key,
          service.durationMinutes,
        );
        setSlots(result);
      } catch (err) {
        setSlotsError(
          err instanceof Error ? err.message : "Não foi possível buscar horários.",
        );
      }
    });
  }

  function next() {
    setFormError(null);
    if (step === 1 && !serviceId) {
      setFormError("Selecione um serviço para continuar.");
      return;
    }
    if (step === 2 && !professionalId) {
      setFormError("Selecione um profissional para continuar.");
      return;
    }
    if (step === 3 && (!date || !time)) {
      setFormError("Escolha uma data e um horário para continuar.");
      return;
    }
    if (step === 4 && (!name.trim() || !phone.trim())) {
      setFormError("Informe seu nome e WhatsApp para continuar.");
      return;
    }
    if (step === 5) {
      submitBooking();
      return;
    }
    setStep((s) => Math.min(s + 1, 5) as typeof step);
  }

  function prev() {
    setFormError(null);
    setStep((s) => Math.max(s - 1, 1) as typeof step);
  }

  function submitBooking() {
    if (!service || !professional || !date || !time) return;
    startSubmitTransition(async () => {
      try {
        const { bookingCode } = await createBooking({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim(),
          serviceId: service.id,
          professionalId: professional.id,
          date,
          time,
          notes: notes.trim(),
        });
        setBookingCode(bookingCode);
        setStep(5);
      } catch (err) {
        setFormError(
          err instanceof Error ? err.message : "Não foi possível confirmar o agendamento.",
        );
      }
    });
  }

  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekday = viewMonth.getDay();
  const isCurrentMonth =
    viewMonth.getFullYear() === today.getFullYear() &&
    viewMonth.getMonth() === today.getMonth();

  if (bookingCode) {
    return (
      <div className="panel p-11 text-center">
        <div className="font-nbarchitekt text-5xl text-ghost-white">✓</div>
        <div className="eyebrow mt-4">Agendamento confirmado</div>
        <h2 className="my-2 font-nbarchitekt text-3xl font-medium">Até breve.</h2>
        <p className="mx-auto mb-5 max-w-md text-pale-mist">
          Seu horário foi enviado para nossa agenda. Vamos cuidar de cada
          detalhe.
        </p>
        <div className="inline-block rounded-md bg-white/[0.06] px-4 py-2.5 font-nbarchitekt text-lg text-ghost-white">
          {bookingCode}
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/minha-conta" className="btn-pill">
            MINHA CONTA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[850px]">
      <div className="my-8 flex items-center justify-between">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`flex items-center gap-2 text-xs ${
              step === i + 1
                ? "text-ghost-white"
                : step > i + 1
                  ? "text-ghost-white"
                  : "text-smoke"
            }`}
          >
            <i
              className={`grid h-6.5 w-6.5 place-items-center rounded-full border not-italic ${
                step >= i + 1 ? "border-white/60 bg-dusk-violet" : "border-ash-border"
              }`}
            >
              {step > i + 1 ? "✓" : i + 1}
            </i>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>

      <div className="panel p-6.5">
        {step === 1 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => selectService(s.id)}
                className={`rounded-xl border p-4 text-left ${
                  serviceId === s.id
                    ? "border-white/60 bg-dusk-violet"
                    : "border-ash-border bg-white/[0.04]"
                }`}
              >
                <b className="mb-1 flex justify-between">
                  {s.name}
                  <span className="text-ghost-white">{formatMoney(s.price)}</span>
                </b>
                <small className="text-pale-mist">
                  {s.description} · {s.durationMinutes} min
                </small>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {professionals.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProfessional(p.id)}
                className={`rounded-xl border p-4 text-left ${
                  professionalId === p.id
                    ? "border-white/60 bg-dusk-violet"
                    : "border-ash-border bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-dusk-violet font-nbarchitekt font-bold text-ghost-white">
                    {p.initials}
                  </div>
                  <span>
                    <b className="block">{p.fullName}</b>
                    <small className="text-pale-mist">{p.specialty}</small>
                  </span>
                  <span className="ml-auto text-pale-mist">★ {p.rating}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <button
                type="button"
                className="text-pale-mist"
                onClick={() =>
                  setViewMonth(
                    new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
                  )
                }
              >
                ←
              </button>
              <div className="eyebrow">
                {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </div>
              <button
                type="button"
                className="text-pale-mist"
                onClick={() =>
                  setViewMonth(
                    new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
                  )
                }
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {WEEKDAY_HEADERS.map((h, i) => (
                <div key={i} className="text-center font-nbarchitekt text-xs text-pale-mist">
                  {h}
                </div>
              ))}
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <div key={`blank-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = new Date(
                  viewMonth.getFullYear(),
                  viewMonth.getMonth(),
                  i + 1,
                );
                const key = toDateKey(d);
                const past = isPast(d, today);
                const selected = date === key;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={past}
                    onClick={() => pickDate(d)}
                    className={`rounded-md p-2.5 text-center ${
                      past
                        ? "text-smoke"
                        : selected
                          ? "bg-dusk-violet text-ghost-white"
                          : "bg-white/[0.06] text-ghost-white hover:bg-dusk-violet"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <b className="mt-5 block text-[13px]">
              Horários disponíveis{" "}
              {date ? `· ${date.split("-").reverse().join("/")}` : "· selecione uma data"}
            </b>
            <div className="mt-3.5 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {loadingSlots && (
                <span className="col-span-full text-xs text-pale-mist">
                  Buscando horários…
                </span>
              )}
              {!loadingSlots && slotsError && (
                <span className="col-span-full text-xs text-alert">
                  {slotsError}
                </span>
              )}
              {!loadingSlots && !slotsError && date && slots.length === 0 && (
                <span className="col-span-full text-xs text-pale-mist">
                  Sem horários disponíveis nesse dia.
                </span>
              )}
              {!loadingSlots &&
                slots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`rounded-md border p-2.5 text-center ${
                      time === t
                        ? "border-white/60 bg-dusk-violet text-ghost-white"
                        : "border-ash-border bg-white/[0.04] text-ghost-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs text-pale-mist">
              NOME COMPLETO
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como podemos chamar você?"
                className="field"
              />
            </label>
            <label className="grid gap-1.5 text-xs text-pale-mist">
              WHATSAPP
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(65) 9 9999-9999"
                className="field"
              />
            </label>
            <label className="grid gap-1.5 text-xs text-pale-mist">
              E-MAIL (OPCIONAL)
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="field"
              />
            </label>
            <label className="grid gap-1.5 text-xs text-pale-mist sm:col-span-2">
              OBSERVAÇÃO (OPCIONAL)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alguma preferência?"
                className="field"
              />
            </label>
          </div>
        )}

        {step === 5 && service && professional && date && time && (
          <div className="panel-overlay p-7">
            <div className="eyebrow">Tudo certo?</div>
            <h2 className="my-2 font-nbarchitekt text-2xl font-medium">
              Seu momento está reservado.
            </h2>
            <div className="grid gap-3">
              {[
                ["Estabelecimento", "Barbearia Bigode Grosso"],
                ["Serviço", `${service.name} · ${service.durationMinutes} min`],
                ["Profissional", professional.fullName],
                ["Data e horário", `${date.split("-").reverse().join("/")} · ${time}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-ash-border pb-2.5 text-pale-mist"
                >
                  <span>{label}</span>
                  <b className="text-ghost-white">{value}</b>
                </div>
              ))}
              <div className="flex justify-between pb-2.5 text-pale-mist">
                <span>Valor</span>
                <b className="text-ghost-white">{formatMoney(service.price)}</b>
              </div>
            </div>
          </div>
        )}

        {formError && (
          <p className="mt-4 rounded-md border border-alert/40 bg-alert/10 px-3 py-2 text-xs text-alert">
            {formError}
          </p>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={prev}
            className={`btn-ghost ${step === 1 ? "invisible" : ""}`}
          >
            ← VOLTAR
          </button>
          <button type="button" onClick={next} disabled={submitting} className="btn-pill">
            {submitting
              ? "CONFIRMANDO…"
              : step === 5
                ? "CONFIRMAR AGENDAMENTO"
                : "CONTINUAR →"}
          </button>
        </div>
      </div>
    </div>
  );
}
