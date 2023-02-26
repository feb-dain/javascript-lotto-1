/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */

import "./css/reset.css";
import "./css/index.css";

import { LottoGame } from "./app/WebLottoGame";
import { closeModal, restartLottoGame } from "./ui/modal";

const lottoGame = new LottoGame();
lottoGame.play();

closeModal();
restartLottoGame();
