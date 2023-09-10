import React, { useRef, useState } from "react";
import "./inputStyles.scss";

const Field = ({ inputRef, label, disabled = false, children }) => {
  return (
    <div className={`field ${disabled ? "disabled" : ""}`}>
      <label onClick={() => inputRef.current?.focus()}>{label}</label>
      {children}
    </div>
  );
};

const FieldInner = ({ inputRef, inFocus, className = "", children }) => {
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
      <FieldInner className="info" inputRef={ref} inFocus={inFocus}>
        {/* {value && (
          <>
            <span className="prefix">{`${value}`}</span>
          </>
        )} */}
        {value}
      </FieldInner>
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
