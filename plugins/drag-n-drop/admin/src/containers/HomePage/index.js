/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState, useRef } from 'react';
import styled, { css } from 'styled-components';

import { Header } from '@buffetjs/custom';
import { GrabLarge } from '@buffetjs/icons';
import { request } from 'strapi-helper-plugin';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const Ul = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Li = styled.li`
  display: flex;
  list-style-type: none;
  margin: 10px 0;
  padding: 10px;
  cursor: 'move';
  background: ${({ theme }) => theme.main.colors.white};
  border-radius: ${({ theme }) => theme.main.sizes.borderRadius};
  box-shadow: 0 2px 4px #e3e9f3;

  ${props => props.snapshot.isDragging && css`
    background: #DC2626;
    color: white
  `}
`

const Col = styled.span`
  padding: 0 10px;
`

let originalOrder = [];

const HomePage = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const response = await request('/whats-ons?_sort=position:DESC', { method: 'GET' })

      setData(response)
      response.forEach(item => originalOrder.push({ ...item }))

      console.log('🚀 ~ originalOrder 1', originalOrder)
    }
    getData()
  }, [])

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = [...data];
    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, {
      ...reorderedItem,
      position: result.destination.index + 1
    })

    items.map((item, index) => item.position = index + 1)

    setData(items);
  }

  function handleBulkUpdate() {
    console.log(data);
  }

  return (
    <div className="container-fluid" style={{ padding: '30px 18px' }}>
      <Header
        actions={[
          {
            label: 'Cancel',
            onClick: () => {
              console.log('🚀 ~ file: index.js ~ line 85 ~ HomePage ~ originalOrder', originalOrder)
              setData([...originalOrder])
            },
            color: 'cancel',
            type: 'button',
          },
          {
            label: 'Save',
            onClick: () => handleBulkUpdate(),
            color: 'success',
            type: 'submit',
          },
        ]}
        title={{
          label: 'Whats On Order',
        }}
      />

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="dragItems">
          {(provided) => (
            <Ul
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.map((item, index) => (
                <Draggable key={item.id} draggableId={`list-${item.id}`} index={index}>
                  {(provided, snapshot) => (
                    <Li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      snapshot={snapshot}
                    >
                      <Col><GrabLarge /></Col>
                      <Col>{item.position ? item.position : '-'}</Col>
                      <Col>{item.heading}</Col>
                    </Li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default memo(HomePage);