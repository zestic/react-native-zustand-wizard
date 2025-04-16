import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.gray400,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: colors.gray600,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  divider: {
    backgroundColor: colors.gray300,
    height: 1,
    marginVertical: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  heading: {
    color: colors.gray800,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderColor: colors.gray300,
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    padding: 8,
  },
  inputError: {
    borderColor: colors.error,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallText: {
    color: colors.gray600,
    fontSize: 14,
  },
  subheading: {
    color: colors.gray700,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    color: colors.gray700,
    fontSize: 16,
  },
  verticalDivider: {
    backgroundColor: colors.gray300,
    marginHorizontal: 8,
    width: 1,
  },
});
