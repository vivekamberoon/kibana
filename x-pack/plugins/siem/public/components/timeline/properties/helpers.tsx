/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  EuiBadge,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiModal,
  EuiOverlayMask,
  EuiToolTip,
} from '@elastic/eui';
import React, { useCallback } from 'react';
import uuid from 'uuid';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { TimelineStatus } from '../../../../common/types/timeline';
import { Note } from '../../../lib/note';
import { Notes } from '../../notes';
import { AssociateNote, UpdateNote } from '../../notes/helpers';
import { NOTES_PANEL_WIDTH } from './notes_size';
import { ButtonContainer, DescriptionContainer, LabelText, NameField, StyledStar } from './styles';
import * as i18n from './translations';
import { SiemPageName } from '../../../pages/home/types';
import { timelineSelectors } from '../../../store/timeline';
import { State } from '../../../store';

export const historyToolTip = 'The chronological history of actions related to this timeline';
export const streamLiveToolTip = 'Update the Timeline as new data arrives';
export const newTimelineToolTip = 'Create a new timeline';

const NotesCountBadge = (styled(EuiBadge)`
  margin-left: 5px;
` as unknown) as typeof EuiBadge;

NotesCountBadge.displayName = 'NotesCountBadge';

type CreateTimeline = ({ id, show }: { id: string; show?: boolean }) => void;
type UpdateIsFavorite = ({ id, isFavorite }: { id: string; isFavorite: boolean }) => void;
type UpdateTitle = ({ id, title }: { id: string; title: string }) => void;
type UpdateDescription = ({ id, description }: { id: string; description: string }) => void;

export const StarIcon = React.memo<{
  isFavorite: boolean;
  timelineId: string;
  updateIsFavorite: UpdateIsFavorite;
}>(({ isFavorite, timelineId: id, updateIsFavorite }) => (
  // TODO: 1 error is: Visible, non-interactive elements with click handlers must have at least one keyboard listener
  // TODO: 2 error is: Elements with the 'button' interactive role must be focusable
  // TODO: Investigate this error
  // eslint-disable-next-line
  <div role="button" onClick={() => updateIsFavorite({ id, isFavorite: !isFavorite })}>
    {isFavorite ? (
      <EuiToolTip data-test-subj="timeline-favorite-filled-star-tool-tip" content={i18n.FAVORITE}>
        <StyledStar data-test-subj="timeline-favorite-filled-star" type="starFilled" size="l" />
      </EuiToolTip>
    ) : (
      <EuiToolTip content={i18n.NOT_A_FAVORITE}>
        <StyledStar data-test-subj="timeline-favorite-empty-star" type="starEmpty" size="l" />
      </EuiToolTip>
    )}
  </div>
));
StarIcon.displayName = 'StarIcon';

interface DescriptionProps {
  description: string;
  timelineId: string;
  updateDescription: UpdateDescription;
}

export const Description = React.memo<DescriptionProps>(
  ({ description, timelineId, updateDescription }) => (
    <EuiToolTip data-test-subj="timeline-description-tool-tip" content={i18n.DESCRIPTION_TOOL_TIP}>
      <DescriptionContainer data-test-subj="description-container">
        <EuiFieldText
          aria-label={i18n.TIMELINE_DESCRIPTION}
          data-test-subj="timeline-description"
          fullWidth={true}
          onChange={(e) => updateDescription({ id: timelineId, description: e.target.value })}
          placeholder={i18n.DESCRIPTION}
          spellCheck={true}
          value={description}
        />
      </DescriptionContainer>
    </EuiToolTip>
  )
);
Description.displayName = 'Description';

interface NameProps {
  timelineId: string;
  title: string;
  updateTitle: UpdateTitle;
}

export const Name = React.memo<NameProps>(({ timelineId, title, updateTitle }) => (
  <EuiToolTip data-test-subj="timeline-title-tool-tip" content={i18n.TITLE}>
    <NameField
      aria-label={i18n.TIMELINE_TITLE}
      data-test-subj="timeline-title"
      onChange={(e) => updateTitle({ id: timelineId, title: e.target.value })}
      placeholder={i18n.UNTITLED_TIMELINE}
      spellCheck={true}
      value={title}
    />
  </EuiToolTip>
));
Name.displayName = 'Name';

interface NewCaseProps {
  onClosePopover: () => void;
  timelineId: string;
  timelineStatus: TimelineStatus;
  timelineTitle: string;
}

export const NewCase = React.memo<NewCaseProps>(
  ({ onClosePopover, timelineId, timelineStatus, timelineTitle }) => {
    const history = useHistory();
    const { savedObjectId } = useSelector((state: State) =>
      timelineSelectors.selectTimeline(state, timelineId)
    );
    const handleClick = useCallback(() => {
      onClosePopover();
      history.push({
        pathname: `/${SiemPageName.case}/create`,
        state: {
          insertTimeline: {
            timelineId,
            timelineSavedObjectId: savedObjectId,
            timelineTitle: timelineTitle.length > 0 ? timelineTitle : i18n.UNTITLED_TIMELINE,
          },
        },
      });
    }, [onClosePopover, history, timelineId, timelineTitle]);

    return (
      <EuiButtonEmpty
        data-test-subj="attach-timeline-case"
        color="text"
        iconSide="left"
        iconType="paperClip"
        disabled={timelineStatus === TimelineStatus.draft}
        onClick={handleClick}
      >
        {i18n.ATTACH_TIMELINE_TO_NEW_CASE}
      </EuiButtonEmpty>
    );
  }
);
NewCase.displayName = 'NewCase';

interface NewTimelineProps {
  createTimeline: CreateTimeline;
  onClosePopover: () => void;
  timelineId: string;
}

export const NewTimeline = React.memo<NewTimelineProps>(
  ({ createTimeline, onClosePopover, timelineId }) => {
    const handleClick = useCallback(() => {
      createTimeline({ id: timelineId, show: true });
      onClosePopover();
    }, [createTimeline, timelineId, onClosePopover]);

    return (
      <EuiButtonEmpty
        data-test-subj="timeline-new"
        color="text"
        iconSide="left"
        iconType="plusInCircle"
        onClick={handleClick}
      >
        {i18n.NEW_TIMELINE}
      </EuiButtonEmpty>
    );
  }
);
NewTimeline.displayName = 'NewTimeline';

interface NotesButtonProps {
  animate?: boolean;
  associateNote: AssociateNote;
  getNotesByIds: (noteIds: string[]) => Note[];
  noteIds: string[];
  size: 's' | 'l';
  showNotes: boolean;
  toggleShowNotes: () => void;
  text?: string;
  toolTip?: string;
  updateNote: UpdateNote;
}

const getNewNoteId = (): string => uuid.v4();

interface LargeNotesButtonProps {
  noteIds: string[];
  text?: string;
  toggleShowNotes: () => void;
}

const LargeNotesButton = React.memo<LargeNotesButtonProps>(({ noteIds, text, toggleShowNotes }) => (
  <EuiButton
    data-test-subj="timeline-notes-button-large"
    onClick={() => toggleShowNotes()}
    size="m"
  >
    <EuiFlexGroup alignItems="center" gutterSize="none" justifyContent="center">
      <EuiFlexItem grow={false}>
        <EuiIcon color="subdued" size="m" type="editorComment" />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        {text && text.length ? <LabelText>{text}</LabelText> : null}
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <NotesCountBadge data-test-subj="timeline-notes-count" color="hollow">
          {noteIds.length}
        </NotesCountBadge>
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiButton>
));
LargeNotesButton.displayName = 'LargeNotesButton';

interface SmallNotesButtonProps {
  noteIds: string[];
  toggleShowNotes: () => void;
}

const SmallNotesButton = React.memo<SmallNotesButtonProps>(({ noteIds, toggleShowNotes }) => (
  <EuiButtonIcon
    aria-label={i18n.NOTES}
    data-test-subj="timeline-notes-button-small"
    iconType="editorComment"
    onClick={() => toggleShowNotes()}
  />
));
SmallNotesButton.displayName = 'SmallNotesButton';

/**
 * The internal implementation of the `NotesButton`
 */
const NotesButtonComponent = React.memo<NotesButtonProps>(
  ({
    animate = true,
    associateNote,
    getNotesByIds,
    noteIds,
    showNotes,
    size,
    toggleShowNotes,
    text,
    updateNote,
  }) => (
    <ButtonContainer animate={animate} data-test-subj="timeline-notes-button-container">
      <>
        {size === 'l' ? (
          <LargeNotesButton noteIds={noteIds} text={text} toggleShowNotes={toggleShowNotes} />
        ) : (
          <SmallNotesButton noteIds={noteIds} toggleShowNotes={toggleShowNotes} />
        )}
        {size === 'l' && showNotes ? (
          <EuiOverlayMask>
            <EuiModal maxWidth={NOTES_PANEL_WIDTH} onClose={toggleShowNotes}>
              <Notes
                associateNote={associateNote}
                getNotesByIds={getNotesByIds}
                noteIds={noteIds}
                getNewNoteId={getNewNoteId}
                updateNote={updateNote}
              />
            </EuiModal>
          </EuiOverlayMask>
        ) : null}
      </>
    </ButtonContainer>
  )
);
NotesButtonComponent.displayName = 'NotesButtonComponent';

export const NotesButton = React.memo<NotesButtonProps>(
  ({
    animate = true,
    associateNote,
    getNotesByIds,
    noteIds,
    showNotes,
    size,
    toggleShowNotes,
    toolTip,
    text,
    updateNote,
  }) =>
    showNotes ? (
      <NotesButtonComponent
        animate={animate}
        associateNote={associateNote}
        getNotesByIds={getNotesByIds}
        noteIds={noteIds}
        showNotes={showNotes}
        size={size}
        toggleShowNotes={toggleShowNotes}
        text={text}
        updateNote={updateNote}
      />
    ) : (
      <EuiToolTip content={toolTip || ''} data-test-subj="timeline-notes-tool-tip">
        <NotesButtonComponent
          animate={animate}
          associateNote={associateNote}
          getNotesByIds={getNotesByIds}
          noteIds={noteIds}
          showNotes={showNotes}
          size={size}
          toggleShowNotes={toggleShowNotes}
          text={text}
          updateNote={updateNote}
        />
      </EuiToolTip>
    )
);
NotesButton.displayName = 'NotesButton';
