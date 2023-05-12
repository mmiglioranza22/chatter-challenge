import styled from 'styled-components';
import { FieldProps } from '../../types/chat';

const ErrorSpan = styled.span`
display: block;
position: relative !important;
width: 100%;
padding: 0.375rem 0.75rem
font-weight: 700;
font-size: 14px;
color: red !important;
background: transparent !important;
`;

function Field(fieldProps: FieldProps) {
  const { title, placeholder, type, name, onChange, value, error } = fieldProps;

  return (
    <div className="content d-flex flex-column mb-4 position-relative" data-aos="fade">
      <span>{title}</span>
      <div className="position-relative" >
        <input
          type={type}
          className="form-control effect-5 position-relative"
          name={name}
          id={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
        <span className="focus-border"></span>
      </div>
        {error && (<ErrorSpan>{error[name]}</ErrorSpan>)}
    </div>
  );
}

export default Field;
