import React, { useRef, useState } from "react";
import "./inputStyles.scss";

const Field = ({
  inputRef,
  label,
  className = "",
  disabled = false,
  children,
}) => {
  return (
    <div className={`field ${disabled ? "disabled" : ""} ${className}`}>
      <label onClick={() => inputRef.current?.focus()}>{label}</label>
      {children}
    </div>
  );
};

const FieldInner = ({
  inputRef,
  inFocus = false,
  className = "",
  children,
}) => {
  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`inputWrapper ${inFocus ? "inFocus" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default function Input({
  value,
  onChange,
  label,
  valuePrefix,
  disabled = false,
  ...props
}) {
  const [inFocus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <Field disabled={disabled} label={label} inputRef={ref}>
      <FieldInner inputRef={ref} inFocus={inFocus}>
        {valuePrefix && <span>{valuePrefix}</span>}
        <input
          disabled={disabled}
          ref={ref}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={value}
          onChange={onChange}
          {...props}
        />
      </FieldInner>
    </Field>
  );
}

export const RangeInput = ({ value, label, disabled = false, ...props }) => {
  const [inFocus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <Field disabled={disabled} label={label} inputRef={ref}>
      <FieldInner inputRef={ref} inFocus={inFocus}>
        {value && (
          <>
            <span className="prefix">x</span>
            <span className="prefix">{`${value}`}</span>
          </>
        )}
        <input
          disabled={disabled}
          ref={ref}
          value={value}
          className="inputRange"
          type="range"
          {...props}
        />
      </FieldInner>
    </Field>
  );
};

export const Info = ({ value, label }) => {
  const [inFocus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <Field label={label} inputRef={ref}>
      <FieldInner className="info" inputRef={ref}>
        {value}
      </FieldInner>
    </Field>
  );
};
export const SideRadio = ({ side, label, setSide, ...props }) => {
  console.log({ side });

  return (
    <Field label={label}>
      <div className="coinSideField">
        <button
          className={`coin  ${side === 0 ? "active" : ""}`}
          onClick={() => setSide(0)}
        >
          <div className="tails">0</div>
        </button>
        <button
          className={`coin  ${side === 1 ? "active" : ""}`}
          onClick={() => setSide(1)}
        >
          <div className="heads">1</div>
        </button>
      </div>
    </Field>
  );
};
export const PlayButton = ({ children, ...props }) => {
  return (
    <button type="button" className="playButton" {...props}>
      {children}
    </button>
  );
};
