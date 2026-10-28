import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AppButton, AppText, AppTextInput } from '../../components';
import { colors, dimensions, strings } from '../../constants';
import { ApiError } from '../../services';
import { spacing, typography } from '../../theme';
import type { NewWeightEntry } from '../../types/api';
import {
  formatDate,
  getErrorMessage,
  parseWeightKg,
  toEntryISO,
} from '../../utils';

type FormErrors = {
  date?: string;
  weight?: string;
  form?: string;
};

type AddWeightModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (entry: NewWeightEntry) => Promise<void>;
};

export function AddWeightModal({
  visible,
  onClose,
  onSubmit,
}: AddWeightModalProps) {
  const [date, setDate] = useState(() => new Date());
  const [weightText, setWeightText] = useState('');
  const [note, setNote] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    if (visible) {
      setDate(new Date());
      setWeightText('');
      setNote('');
      setShowPicker(false);
      setErrors({});
    }
  }, [visible]);

  const handleClose = () => {
    if (!savingRef.current) {
      onClose();
    }
  };

  const handleDatePicked = (picked: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    setDate(picked);
    setErrors(prev => ({ ...prev, date: undefined, form: undefined }));
  };

  const handleSave = async () => {
    if (savingRef.current) {
      return;
    }
    const parsed = parseWeightKg(weightText);
    if (!parsed.ok) {
      setErrors({ weight: parsed.error });
      return;
    }

    savingRef.current = true;
    setIsSaving(true);
    setErrors({});
    try {
      await onSubmit({
        dateISO: toEntryISO(date),
        weightKg: parsed.value,
        note: note.trim() || null,
      });
      onClose();
    } catch (error) {
      setErrors(toFormErrors(error));
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClose}
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Pressable onPress={handleClose} style={styles.backdropTouch} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <AppText variant="title">{strings.addWeight.title}</AppText>
            <Pressable
              accessibilityLabel={strings.addWeight.close}
              accessibilityRole="button"
              disabled={isSaving}
              hitSlop={spacing.sm}
              onPress={handleClose}
            >
              <AppText color="secondary" variant="title">
                ✕
              </AppText>
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            <AppText color="secondary" style={styles.label} variant="caption">
              {strings.addWeight.date}
            </AppText>
            <Pressable
              accessibilityRole="button"
              disabled={isSaving}
              onPress={() => setShowPicker(prev => !prev)}
              style={[styles.dateField, errors.date && styles.fieldError]}
            >
              <AppText>{formatDate(date)}</AppText>
              <AppText color="secondary">▾</AppText>
            </Pressable>
            {errors.date ? (
              <AppText color="error" style={styles.errorText} variant="caption">
                {errors.date}
              </AppText>
            ) : null}
            {showPicker ? (
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                mode="date"
                onDismiss={() => setShowPicker(false)}
                onValueChange={(_event, picked) => handleDatePicked(picked)}
                value={date}
              />
            ) : null}

            <View style={styles.spacer} />
            <AppTextInput
              editable={!isSaving}
              error={errors.weight}
              keyboardType="decimal-pad"
              label={strings.addWeight.weight}
              onChangeText={text => {
                setWeightText(text);
                setErrors(prev => ({ ...prev, weight: undefined }));
              }}
              placeholder="e.g. 72.5"
              value={weightText}
            />
            <AppTextInput
              editable={!isSaving}
              label={strings.addWeight.note}
              maxLength={200}
              onChangeText={setNote}
              value={note}
            />

            {errors.form ? (
              <AppText color="error" style={styles.formError}>
                {errors.form}
              </AppText>
            ) : null}

            <AppButton
              loading={isSaving}
              onPress={handleSave}
              title={strings.addWeight.save}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function toFormErrors(error: unknown): FormErrors {
  if (error instanceof ApiError && error.status === 422) {
    if (error.field === 'weightKg') {
      return { weight: error.message };
    }
    if (error.field === 'dateISO') {
      return { date: error.message };
    }
  }
  return { form: `${strings.addWeight.notSaved} ${getErrorMessage(error)}` };
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.backdrop,
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    maxHeight: '85%',
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopLeftRadius: dimensions.radiusLg,
    borderTopRightRadius: dimensions.radiusLg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: dimensions.buttonHeight,
    paddingHorizontal: spacing.md,
    borderRadius: dimensions.radiusSm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  spacer: {
    height: spacing.md,
  },
  formError: {
    marginBottom: spacing.md,
  },
});
