import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type TextInputInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signIn } from '../../auth';
import { AppButton, AppText, AppTextInput } from '../../components';
import { colors, dimensions, strings } from '../../constants';
import { ApiError, login } from '../../services';
import { spacing } from '../../theme';
import { getErrorMessage, validateLogin, type LoginErrors } from '../../utils';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const passwordRef = useRef<TextInputInstance>(null);

  const handleSubmit = async () => {
    if (submittingRef.current) {
      return;
    }
    const errors = validateLogin(email, password);
    setFieldErrors(errors);
    setFormError(null);
    if (errors.email || errors.password) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const { token } = await login(email.trim(), password);
      await signIn(token);
    } catch (error) {
      submittingRef.current = false;
      setIsSubmitting(false);
      showLoginError(error);
    }
  };

  const showLoginError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 401) {
      setFormError(strings.login.wrongCredentials);
    } else if (
      error instanceof ApiError &&
      error.status === 422 &&
      (error.field === 'email' || error.field === 'password')
    ) {
      setFieldErrors({ [error.field]: error.message });
    } else {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <AppText style={styles.title} variant="heading">
              {strings.appName}
            </AppText>

            <AppTextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              editable={!isSubmitting}
              error={fieldErrors.email}
              keyboardType="email-address"
              label={strings.login.email}
              onChangeText={text => {
                setEmail(text);
                setFieldErrors(prev => ({ ...prev, email: undefined }));
              }}
              onSubmitEditing={() => passwordRef.current?.focus()}
              placeholder="coach@molt.app"
              returnKeyType="next"
              textContentType="emailAddress"
              value={email}
            />

            <AppTextInput
              autoCapitalize="none"
              autoComplete="password"
              editable={!isSubmitting}
              error={fieldErrors.password}
              label={strings.login.password}
              onChangeText={text => {
                setPassword(text);
                setFieldErrors(prev => ({ ...prev, password: undefined }));
              }}
              onSubmitEditing={handleSubmit}
              ref={passwordRef}
              returnKeyType="go"
              secureTextEntry
              textContentType="password"
              value={password}
            />

            <AppButton
              loading={isSubmitting}
              onPress={handleSubmit}
              title={strings.login.submit}
            />

            {formError ? (
              <AppText
                accessibilityLiveRegion="polite"
                color="error"
                style={styles.formError}
              >
                {formError}
              </AppText>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: dimensions.maxContentWidth,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: dimensions.radiusLg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  formError: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
