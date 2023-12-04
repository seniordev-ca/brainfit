import { render, screen } from '@testing-library/react';
import { ListItem } from 'Components/ListItem/ListItem';
import { ListGroup } from './ListGroup';
import { ReactComponent as StarSVG } from '../../img/icon_star.svg';
import { Switch } from 'Components/Switch/Switch';

test('renders empty list group with header', () => {
  render(<ListGroup heading='Group heading' />);
  const text = screen.getByText('Group heading');
  expect(text).toBeInTheDocument();
});

test('renders list group with header and items', () => {
  const items = [
    <ListItem label="Text" suffix="Test Text" chevron={true} />,
    <ListItem label="Text" prefix={<StarSVG />} chevron={true} />,
    <ListItem label="Text" suffix={<Switch id='switch' initialValue={false} />} />,
  ]
  render(<ListGroup heading='Group heading' items={items} />);
  const text = screen.getByText('Test Text');
  expect(text).toBeInTheDocument();
});