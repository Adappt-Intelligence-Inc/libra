import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {PasswordCriteriaComp} from './PasswordCriteria';

export default function PasswordValidation(props) {
  const {copyText, setIsDisabled, isDisabled} = props;
  const [minimumEightChar, setMinimumEightChar] = useState(false);
  const [oneNumber, setOneNumber] = useState(false);
  const [oneLetter, setOneLetter] = useState(false);
  const [specialCharacter, setSpecialCharacter] = useState(false);

  // Validation
  useEffect(() => {
    const number = /(?=.*\d)/;
    const letter = /.*[a-zA-Z].*/;
    const special = /(?=.*[@#$%^&*+=!`/,])/;
    let minimumEightChar = false;
    let oneNumber = false;
    let oneLetter = false;
    let specialCharacter = false;

    // Number validation
    if (number.test(copyText)) {
      oneNumber = true;
    } else {
      oneNumber = false;
    }

    // Uppercase Validation
    if (letter.test(copyText)) {
      setIsDisabled(true);
      oneLetter = true;
    } else {
      oneLetter = false;
    }

    // Special Validation
    if (special.test(copyText)) {
      setIsDisabled(true);
      specialCharacter = true;
    } else {
      specialCharacter = false;
    }

    // Length validation
    if (copyText?.length >= 8) {
      minimumEightChar = true;
    } else {
      minimumEightChar = false;
    }

    setOneLetter(oneLetter);
    setMinimumEightChar(minimumEightChar);
    setSpecialCharacter(specialCharacter);
    setOneNumber(oneNumber);

    if (minimumEightChar && oneNumber && oneLetter && specialCharacter) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    if (copyText === '') {
      setIsDisabled(false);
    }
  }, [
    copyText,
    minimumEightChar,
    oneNumber,
    setIsDisabled,
    specialCharacter,
    oneLetter,
  ]);

  return isDisabled ? (
    <View>
      <PasswordCriteriaComp
        isError={oneLetter}
        copy={'\u2022  At least 1 letter'}
      />
      <PasswordCriteriaComp
        copy={'\u2022  At least 8 characters'}
        isError={minimumEightChar}
      />
      <PasswordCriteriaComp
        isError={oneNumber}
        copy={'\u2022  At least 1 number'}
      />
      <PasswordCriteriaComp
        isError={specialCharacter}
        copy={'\u2022  1 special character: @#$%*+'}
      />
    </View>
  ) : (
    <></>
  );
}
