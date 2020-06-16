import styled from 'styled-components';
import { lighten } from 'polished';

export const Container = styled.a`
  background: #1db954;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 32px 48px;
  border-radius: 10px;
  transition: background 0.2s;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${lighten(0.03, '#1db954')};
  }

  svg {
    margin-right: 16px;
  }
`;
