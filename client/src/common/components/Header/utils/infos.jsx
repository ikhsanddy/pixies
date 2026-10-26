import {Trans} from "react-i18next";
import {RELEASES_URL, DOCS_URL} from "@/index";

export const updateInfo = (version) => <Trans values={{version}} components={{Changes: <a href={RELEASES_URL} target="_blank"/>,
    DLLink: <a href={DOCS_URL + "/setup/linux.md"} target="_blank"/>}}>info.update</Trans>
