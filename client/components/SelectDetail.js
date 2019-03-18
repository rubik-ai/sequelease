import React, { Component } from 'react';
import JoinSearchBar from './JoinSearchBar';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export default class SelectDetail extends Component {
  constructor(props) {
    super(props);

    // To blur search boxes on drag
    document.addEventListener('mousedown', e => {
      if (
        [...e.target.classList].includes('drag') &&
        e.target.tagName === 'DIV'
      ) {
        document.activeElement.blur();
      }
    });
  }

  modifyTargetColumn = (fieldSequence, column) => {
    const tableName = column.split('.')[0];
    const columnName = column.split('.')[1];

    const foundTable = this.props.hrDb.tables.find(table => {
      return table.name === tableName;
    });

    let foundColumn = null;
    if (foundTable) {
      foundColumn = foundTable.fields.find(field => {
        return field.name === columnName;
      });
    }

    this.props.query.select.selectedColumns[fieldSequence] = {
      name: column,
      type: foundColumn && foundColumn.type,
    } || { name: column, type: null };
    this.props.updateQueryState();
  };

  handleAddClick = fieldSequence => {
    this.props.query.select.selectedColumns.splice(fieldSequence + 1, 0, {
      name: '',
      type: null,
    });
    this.props.updateQueryState();
  };

  handleRemoveClick = fieldSequence => {
    this.props.query.select.selectedColumns.splice(fieldSequence, 1);
    this.props.updateQueryState();
  };

  // eslint-disable-next-line complexity
  onDragEnd = result => {
    if (result.destination) {
      let sourceJoin = this.props.query.select.selectedColumns.splice(
        result.source.index,
        1
      )[0];
      this.props.query.select.selectedColumns.splice(
        result.destination.index,
        0,
        sourceJoin
      );
    }
    this.props.updateQueryState();
  };

  render() {
    const { queryState } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppableSelect">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <div>
                {queryState.select.selectedColumns.map((field, i) => {
                  return (
                    <Draggable
                      key={`itemS-${i}`}
                      draggableId={`itemS-${i}`}
                      index={i}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div>
                            <div
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              {i === 0 ? (
                                <div className="drag">
                                  <button
                                    onClick={this.handleAddClick.bind(this, i)}
                                    type="button"
                                    style={{ marginRight: '10px' }}
                                  >
                                    +
                                  </button>
                                  {queryState.select.selectedColumns.length >
                                  1 ? (
                                    <button
                                      onClick={this.handleRemoveClick.bind(
                                        this,
                                        i
                                      )}
                                      type="button"
                                      style={{ marginRight: '10px' }}
                                    >
                                      -
                                    </button>
                                  ) : (
                                    ''
                                  )}
                                  <div style={{ display: 'inline-block' }}>
                                    <JoinSearchBar
                                      key={`jsbt2-${i}`}
                                      joinSequence={i}
                                      modifyTargetColumn={
                                        this.modifyTargetColumn
                                      }
                                      columnsToSelect={queryState.select.tables}
                                      selectedColumn={field.name}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="drag">
                                  <button
                                    onClick={this.handleAddClick.bind(this, i)}
                                    type="button"
                                    style={{ marginRight: '10px' }}
                                  >
                                    +
                                  </button>

                                  <button
                                    onClick={this.handleRemoveClick.bind(
                                      this,
                                      i
                                    )}
                                    type="button"
                                    style={{ marginRight: '10px' }}
                                  >
                                    -
                                  </button>
                                  <div style={{ display: 'inline-block' }}>
                                    <JoinSearchBar
                                      key={`jsbt2-${i}`}
                                      joinSequence={i}
                                      modifyTargetColumn={
                                        this.modifyTargetColumn
                                      }
                                      columnsToSelect={queryState.select.tables}
                                      selectedColumn={field.name}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
