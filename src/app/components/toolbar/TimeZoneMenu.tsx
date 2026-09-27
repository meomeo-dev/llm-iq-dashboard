import React from "react";
import type { TimeZoneOption } from "../timeline/zoned-time";
import { offsetLabel } from "../timeline/zoned-time";
import { Menu } from "../menu/Menu";
import { zoneLabel } from "./toolbar-calc";

interface TimeZoneMenuProps {
  readonly timeZone: string;
  readonly timeZones: readonly TimeZoneOption[];
  readonly open: boolean;
  readonly onToggle: () => void;
  readonly onClose: () => void;
  readonly onPickTimeZone: (tz: string) => void;
}

/** 时区切换下拉菜单 */
export function TimeZoneMenu({
  timeZone,
  timeZones,
  open,
  onToggle,
  onClose,
  onPickTimeZone,
}: TimeZoneMenuProps) {
  return (
    <Menu
      label={zoneLabel(timeZones, timeZone)}
      align="right"
      buttonClassName="menu-button-small"
      open={open}
      onToggle={onToggle}
      onClose={onClose}
    >
      {timeZones.map((option) => (
        <button
          key={option.id}
          type="button"
          className="menu-row"
          role="menuitemradio"
          aria-checked={option.id === timeZone}
          onClick={() => {
            onPickTimeZone(option.id);
            onClose();
          }}
        >
          <span className="radio" aria-hidden="true" />
          <span className="menu-row-name">
            {option.label} <span className="zone-id">{option.id}</span>
          </span>
          <span className="menu-row-count">{offsetLabel(new Date(), option.id)}</span>
        </button>
      ))}
    </Menu>
  );
}
