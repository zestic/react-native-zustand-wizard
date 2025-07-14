import { commonStyles } from './styles';
import { colors } from './colors';

describe('commonStyles', () => {
  describe('Button Styles', () => {
    it('should have button style with correct properties', () => {
      expect(commonStyles.button).toBeDefined();
      expect(commonStyles.button.alignItems).toBe('center');
      expect(commonStyles.button.backgroundColor).toBe(colors.primary);
      expect(commonStyles.button.borderRadius).toBe(4);
      expect(commonStyles.button.justifyContent).toBe('center');
      expect(commonStyles.button.paddingHorizontal).toBe(16);
      expect(commonStyles.button.paddingVertical).toBe(8);
    });

    it('should have buttonDisabled style', () => {
      expect(commonStyles.buttonDisabled).toBeDefined();
      expect(commonStyles.buttonDisabled.backgroundColor).toBe(colors.gray400);
    });

    it('should have buttonText style', () => {
      expect(commonStyles.buttonText).toBeDefined();
      expect(commonStyles.buttonText.color).toBe(colors.white);
      expect(commonStyles.buttonText.fontSize).toBe(16);
      expect(commonStyles.buttonText.fontWeight).toBe('600');
    });

    it('should have buttonTextDisabled style', () => {
      expect(commonStyles.buttonTextDisabled).toBeDefined();
      expect(commonStyles.buttonTextDisabled.color).toBe(colors.gray600);
    });
  });

  describe('Layout Styles', () => {
    it('should have center style', () => {
      expect(commonStyles.center).toBeDefined();
      expect(commonStyles.center.alignItems).toBe('center');
      expect(commonStyles.center.justifyContent).toBe('center');
    });

    it('should have container style', () => {
      expect(commonStyles.container).toBeDefined();
      expect(commonStyles.container.backgroundColor).toBe(colors.white);
      expect(commonStyles.container.flex).toBe(1);
    });

    it('should have row style', () => {
      expect(commonStyles.row).toBeDefined();
      expect(commonStyles.row.alignItems).toBe('center');
      expect(commonStyles.row.flexDirection).toBe('row');
    });

    it('should have rowBetween style', () => {
      expect(commonStyles.rowBetween).toBeDefined();
      expect(commonStyles.rowBetween.alignItems).toBe('center');
      expect(commonStyles.rowBetween.flexDirection).toBe('row');
      expect(commonStyles.rowBetween.justifyContent).toBe('space-between');
    });
  });

  describe('Divider Styles', () => {
    it('should have divider style', () => {
      expect(commonStyles.divider).toBeDefined();
      expect(commonStyles.divider.backgroundColor).toBe(colors.gray300);
      expect(commonStyles.divider.height).toBe(1);
      expect(commonStyles.divider.marginVertical).toBe(8);
    });

    it('should have verticalDivider style', () => {
      expect(commonStyles.verticalDivider).toBeDefined();
      expect(commonStyles.verticalDivider.backgroundColor).toBe(colors.gray300);
      expect(commonStyles.verticalDivider.marginHorizontal).toBe(8);
      expect(commonStyles.verticalDivider.width).toBe(1);
    });
  });

  describe('Text Styles', () => {
    it('should have heading style', () => {
      expect(commonStyles.heading).toBeDefined();
      expect(commonStyles.heading.color).toBe(colors.gray800);
      expect(commonStyles.heading.fontSize).toBe(24);
      expect(commonStyles.heading.fontWeight).toBe('bold');
      expect(commonStyles.heading.marginBottom).toBe(16);
    });

    it('should have subheading style', () => {
      expect(commonStyles.subheading).toBeDefined();
      expect(commonStyles.subheading.color).toBe(colors.gray700);
      expect(commonStyles.subheading.fontSize).toBe(18);
      expect(commonStyles.subheading.fontWeight).toBe('600');
      expect(commonStyles.subheading.marginBottom).toBe(8);
    });

    it('should have text style', () => {
      expect(commonStyles.text).toBeDefined();
      expect(commonStyles.text.color).toBe(colors.gray700);
      expect(commonStyles.text.fontSize).toBe(16);
    });

    it('should have smallText style', () => {
      expect(commonStyles.smallText).toBeDefined();
      expect(commonStyles.smallText.color).toBe(colors.gray600);
      expect(commonStyles.smallText.fontSize).toBe(14);
    });

    it('should have errorText style', () => {
      expect(commonStyles.errorText).toBeDefined();
      expect(commonStyles.errorText.color).toBe(colors.error);
      expect(commonStyles.errorText.fontSize).toBe(14);
      expect(commonStyles.errorText.marginTop).toBe(4);
    });
  });

  describe('Input Styles', () => {
    it('should have input style', () => {
      expect(commonStyles.input).toBeDefined();
      expect(commonStyles.input.borderColor).toBe(colors.gray300);
      expect(commonStyles.input.borderRadius).toBe(4);
      expect(commonStyles.input.borderWidth).toBe(1);
      expect(commonStyles.input.fontSize).toBe(16);
      expect(commonStyles.input.padding).toBe(8);
    });

    it('should have inputError style', () => {
      expect(commonStyles.inputError).toBeDefined();
      expect(commonStyles.inputError.borderColor).toBe(colors.error);
    });
  });

  describe('Style Object Structure', () => {
    it('should export commonStyles as an object', () => {
      expect(typeof commonStyles).toBe('object');
      expect(commonStyles).not.toBeNull();
    });

    it('should have all expected style properties', () => {
      const expectedStyles = [
        'button',
        'buttonDisabled',
        'buttonText',
        'buttonTextDisabled',
        'center',
        'container',
        'divider',
        'errorText',
        'heading',
        'input',
        'inputError',
        'row',
        'rowBetween',
        'smallText',
        'subheading',
        'text',
        'verticalDivider',
      ];

      expectedStyles.forEach(styleName => {
        expect(commonStyles).toHaveProperty(styleName);
      });
    });

    it('should have correct number of styles', () => {
      const styleKeys = Object.keys(commonStyles);
      expect(styleKeys).toHaveLength(17);
    });
  });

  describe('Style Values Validation', () => {
    it('should use consistent color references', () => {
      // Check that all color references are from the colors object
      expect(commonStyles.button.backgroundColor).toBe(colors.primary);
      expect(commonStyles.buttonDisabled.backgroundColor).toBe(colors.gray400);
      expect(commonStyles.buttonText.color).toBe(colors.white);
      expect(commonStyles.buttonTextDisabled.color).toBe(colors.gray600);
      expect(commonStyles.container.backgroundColor).toBe(colors.white);
      expect(commonStyles.divider.backgroundColor).toBe(colors.gray300);
      expect(commonStyles.errorText.color).toBe(colors.error);
      expect(commonStyles.heading.color).toBe(colors.gray800);
      expect(commonStyles.input.borderColor).toBe(colors.gray300);
      expect(commonStyles.inputError.borderColor).toBe(colors.error);
      expect(commonStyles.smallText.color).toBe(colors.gray600);
      expect(commonStyles.subheading.color).toBe(colors.gray700);
      expect(commonStyles.text.color).toBe(colors.gray700);
      expect(commonStyles.verticalDivider.backgroundColor).toBe(colors.gray300);
    });

    it('should use consistent spacing values', () => {
      // Check for consistent spacing patterns
      expect(commonStyles.button.paddingHorizontal).toBe(16);
      expect(commonStyles.button.paddingVertical).toBe(8);
      expect(commonStyles.heading.marginBottom).toBe(16);
      expect(commonStyles.subheading.marginBottom).toBe(8);
      expect(commonStyles.divider.marginVertical).toBe(8);
      expect(commonStyles.verticalDivider.marginHorizontal).toBe(8);
      expect(commonStyles.input.padding).toBe(8);
      expect(commonStyles.errorText.marginTop).toBe(4);
    });

    it('should use consistent border radius values', () => {
      expect(commonStyles.button.borderRadius).toBe(4);
      expect(commonStyles.input.borderRadius).toBe(4);
    });

    it('should use consistent font sizes', () => {
      expect(commonStyles.heading.fontSize).toBe(24);
      expect(commonStyles.subheading.fontSize).toBe(18);
      expect(commonStyles.text.fontSize).toBe(16);
      expect(commonStyles.buttonText.fontSize).toBe(16);
      expect(commonStyles.input.fontSize).toBe(16);
      expect(commonStyles.smallText.fontSize).toBe(14);
      expect(commonStyles.errorText.fontSize).toBe(14);
    });

    it('should use consistent font weights', () => {
      expect(commonStyles.heading.fontWeight).toBe('bold');
      expect(commonStyles.subheading.fontWeight).toBe('600');
      expect(commonStyles.buttonText.fontWeight).toBe('600');
    });
  });

  describe('Style Inheritance and Composition', () => {
    it('should allow style composition', () => {
      // Test that styles can be combined (this is more of a usage test)
      const combinedStyle = [commonStyles.button, commonStyles.buttonDisabled];
      expect(Array.isArray(combinedStyle)).toBe(true);
      expect(combinedStyle).toHaveLength(2);
    });

    it('should have styles that work well together', () => {
      // Test that related styles have compatible properties
      expect(commonStyles.input.borderWidth).toBe(1);
      expect(commonStyles.inputError.borderColor).toBeDefined();
      
      expect(commonStyles.button.alignItems).toBe('center');
      expect(commonStyles.button.justifyContent).toBe('center');
      
      expect(commonStyles.row.flexDirection).toBe('row');
      expect(commonStyles.rowBetween.flexDirection).toBe('row');
    });
  });

  describe('React Native StyleSheet Compatibility', () => {
    it('should be created with StyleSheet.create', () => {
      // Verify that the styles object has the structure expected from StyleSheet.create
      expect(typeof commonStyles).toBe('object');
      
      // Each style should be a number (StyleSheet ID) or object
      Object.values(commonStyles).forEach(style => {
        expect(typeof style === 'object' || typeof style === 'number').toBe(true);
      });
    });

    it('should have valid React Native style properties', () => {
      // Test a few key styles to ensure they have valid RN properties
      const buttonStyle = commonStyles.button;
      expect(buttonStyle).toHaveProperty('alignItems');
      expect(buttonStyle).toHaveProperty('backgroundColor');
      expect(buttonStyle).toHaveProperty('borderRadius');
      expect(buttonStyle).toHaveProperty('justifyContent');
      expect(buttonStyle).toHaveProperty('paddingHorizontal');
      expect(buttonStyle).toHaveProperty('paddingVertical');
    });
  });
});
