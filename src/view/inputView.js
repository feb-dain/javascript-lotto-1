import { rl } from "../util/console";
import { errorCatcher } from "../domain/errorCatcher";
import {
  validateBonusNumber,
  validatePurchaseAmount,
  validateRestartOrQuitCommend,
  validateWinningLottoNumbers,
} from "../domain/validator";
import { INPUT_MESSAGE } from "../constants";
import { splitAndTrimString } from "../util";
const { PURCHASE_AMOUNT, LOTTO_NUMBER, BONUS_NUMBER, RESTART_OR_QUIT } = INPUT_MESSAGE;

export const inputView = {
  readline(message) {
    return rl.question(message);
  },
};

export const readPurchaseAmount = async () => {
  const purchaseAmount = await inputView.readline(PURCHASE_AMOUNT);

  if (!errorCatcher(() => validatePurchaseAmount(purchaseAmount))) return readPurchaseAmount();

  return Number(purchaseAmount);
};

export const readWinningLottoNumbers = async () => {
  const winningLottoNumbers = await inputView.readline(LOTTO_NUMBER);
  const trimmedWinningLottoNumbers = splitAndTrimString(winningLottoNumbers);

  if (!errorCatcher(() => validateWinningLottoNumbers(trimmedWinningLottoNumbers))) {
    return readWinningLottoNumbers();
  }

  return trimmedWinningLottoNumbers.map(Number);
};

export const readBonusNumber = async (winningLottoNumbers) => {
  const bonusNumber = await inputView.readline(BONUS_NUMBER);

  if (!errorCatcher(() => !validateBonusNumber(bonusNumber, winningLottoNumbers))) {
    return readBonusNumber(winningLottoNumbers);
  }

  return Number(bonusNumber);
};

export const readRestartOrQuitCommend = async () => {
  const restartOrQuitCommend = await inputView.readline(RESTART_OR_QUIT);

  if (!errorCatcher(() => !validateRestartOrQuitCommend(restartOrQuitCommend))) {
    return readRestartOrQuitCommend();
  }

  return restartOrQuitCommend.toLowerCase();
};
