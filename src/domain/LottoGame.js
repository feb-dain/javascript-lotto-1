import { randomNumberBetween } from "../util/randomNumberMaker";
import { inputView } from "../view/inputView";
import { outputView } from "../view/outputView";
import { close } from "../util/console";

import {
  validateBonusNumber,
  validatePurchaseAmount,
  validateRestartOrQuitCommend,
  validateWinningLottoNumbers,
} from "./validator";

export class LottoGame {
  async play() {
    const purchaseAmount = await this.readPurchaseAmount();

    const numberOfPurchasedLottoTickets = purchaseAmount / 1000;
    const lottoTickets = this.makeLottoTickets(numberOfPurchasedLottoTickets);
    outputView.printNumberOfPurchasedLottoTickets(numberOfPurchasedLottoTickets);
    outputView.printLottoTickets(lottoTickets);

    const winningLottoNumbers = await this.readWinningLottoNumbers();
    const bonusNumber = await this.readBonusNumber(winningLottoNumbers);
    const placesOfLottoTickets = this.getPlacesOfLottoTickets(
      lottoTickets,
      winningLottoNumbers,
      bonusNumber
    );

    outputView.printPlacesOfLottoTickets(placesOfLottoTickets);

    outputView.printRateOfReturn(
      this.getRateOfReturn(this.getTotalPrize(placesOfLottoTickets), purchaseAmount)
    );

    const restartOrQuit = await this.readRestartOrQuitCommend();
    this.shouldRestart(restartOrQuit) ? this.play() : close();
  }

  async readPurchaseAmount() {
    const purchaseAmountString = await inputView.readline("로또 구입 금액을 입력해 주세요.");
    if (!validatePurchaseAmount(purchaseAmountString)) return this.readPurchaseAmount();
    return Number(purchaseAmountString);
  }

  async readWinningLottoNumbers() {
    const winningLottoNumbers = (
      await inputView.readline("당첨 번호를 콤마(,)로 구분해서 입력해 주세요.")
    ).split(",");
    if (!validateWinningLottoNumbers(winningLottoNumbers)) return this.readWinningLottoNumbers();
    return winningLottoNumbers.map((number) => Number(number));
  }

  async readBonusNumber(winningLottoNumbers) {
    const bonusNumber = await inputView.readline("보너스 번호를 입력해 주세요.");
    if (!validateBonusNumber(bonusNumber, winningLottoNumbers))
      return this.readBonusNumber(winningLottoNumbers);
    return Number(bonusNumber);
  }

  getPlacesOfLottoTickets(lottoTickets, winningLottoNumbers, bonusNumber) {
    const placesOfLottoTickets = {
      FIFTH_PLACE: 0,
      FOURTH_PLACE: 0,
      THIRD_PLACE: 0,
      SECOND_PLACE: 0,
      FIRST_PLACE: 0,
    };

    lottoTickets.forEach((lottoTicket) => {
      const numberOfMatchingLottoNumbers = this.getNumberOfMatchingLottoNumbers(
        lottoTicket,
        winningLottoNumbers
      );

      switch (numberOfMatchingLottoNumbers) {
        case 6:
          placesOfLottoTickets.FIRST_PLACE += 1;
          break;
        case 5:
          lottoTicket.includes(bonusNumber)
            ? (placesOfLottoTickets.SECOND_PLACE += 1)
            : (placesOfLottoTickets.THIRD_PLACE += 1);
          break;
        case 4:
          placesOfLottoTickets.FOURTH_PLACE += 1;
          break;
        case 3:
          placesOfLottoTickets.FOURTH_PLACE += 1;
          break;
      }
    });

    return placesOfLottoTickets;
  }

  getTotalPrize(placesOfLottoTickets) {
    return (
      placesOfLottoTickets.FIFTH_PLACE * 5000 +
      placesOfLottoTickets.FOURTH_PLACE * 50000 +
      placesOfLottoTickets.THIRD_PLACE * 1500000 +
      placesOfLottoTickets.SECOND_PLACE * 30000000 +
      placesOfLottoTickets.FIRST_PLACE * 2000000000
    );
  }

  getRateOfReturn(totalPrize, purchaseAmount) {
    return Number(((totalPrize / purchaseAmount) * 100).toFixed(1));
  }

  async readRestartOrQuitCommend() {
    const restartOrQuitCommend = await inputView.readline("다시 시작하시겠습니까? (y/n)");
    if (!validateRestartOrQuitCommend(restartOrQuitCommend)) return this.readRestartOrQuitCommend();
    return restartOrQuitCommend;
  }

  shouldRestart(restartOrQuitCommend) {
    return ["y", "Y"].includes(restartOrQuitCommend) ? true : false;
  }

  makeLottoTickets(numberOfTickets) {
    const lottoTickets = Array.from({ length: numberOfTickets }, this.makeLottoTicket);

    return lottoTickets;
  }

  makeLottoTicket() {
    const lottoTicket = new Set();

    while (6 > lottoTicket.size) {
      lottoTicket.add(randomNumberBetween());
    }

    return [...lottoTicket];
  }

  getNumberOfMatchingLottoNumbers(lottoTicket, winningLottoNumbers) {
    return (
      lottoTicket.length +
      winningLottoNumbers.length -
      new Set([...lottoTicket, ...winningLottoNumbers]).size
    );
  }
}
