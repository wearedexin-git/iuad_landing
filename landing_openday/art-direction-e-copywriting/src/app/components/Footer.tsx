import { Fragment } from "react";
import openDayConfig from "../config/openday-config.json";

type FooterContact = {
  title: string;
  phone: string;
  email: string;
};

const footerContacts = (openDayConfig.footer?.contacts as FooterContact[] | undefined) ?? [];

export function Footer() {
  return (
    <footer className="bg-[#201f1f] flex items-center justify-center p-4">
      <p className="font-sarabun font-normal text-[11px] md:text-[12px] text-white text-center leading-relaxed">
        {footerContacts.map((contact, index) => (
          <Fragment key={`${contact.title}-${index}`}>
            {index > 0 ? "; " : null}
            {contact.title} | telefono {contact.phone} | email{" "}
            <a href={`mailto:${contact.email}`} className="underline hover:opacity-80">
              {contact.email}
            </a>
          </Fragment>
        ))}
      </p>
    </footer>
  );
}
