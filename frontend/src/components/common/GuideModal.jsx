import React from 'react';
import { X, Info, TrendingUp, Building2, Home } from 'lucide-react';

const GuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center">
            <Info className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">사용 가이드</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* 데이터 출처 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                데이터 출처
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>실거래가 데이터:</strong> 국토교통부 실거래가 공개시스템 (최근 24개월)</li>
                  <li><strong>건축 정보:</strong> 주요 아파트 건축물대장 정보</li>
                  <li><strong>업데이트:</strong> 실시간 조회</li>
                </ul>
              </div>
            </div>

            {/* 건축 용어 설명 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-green-600" />
                건축 정보 용어
              </h3>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="font-semibold text-green-900 mb-2">용적률 (Floor Area Ratio)</div>
                  <p className="text-sm text-gray-700 mb-2">
                    대지면적 대비 건축물 연면적의 비율입니다. 높을수록 건물이 높고 많은 세대가 있습니다.
                  </p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>• <strong>200% 미만:</strong> 중저층 (쾌적한 환경)</div>
                    <div>• <strong>200-300%:</strong> 고층 (일반적인 아파트)</div>
                    <div>• <strong>300% 이상:</strong> 초고층 (역세권 등)</div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="font-semibold text-green-900 mb-2">건폐율 (Building Coverage Ratio)</div>
                  <p className="text-sm text-gray-700 mb-2">
                    대지면적 대비 건축면적의 비율입니다. 낮을수록 단지 내 공원, 조경 등 여유공간이 많습니다.
                  </p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>• <strong>20% 미만:</strong> 매우 쾌적 (넓은 조경)</div>
                    <div>• <strong>20-30%:</strong> 보통 (일반적인 아파트)</div>
                    <div>• <strong>30% 이상:</strong> 밀집 (건물 간격 좁음)</div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="font-semibold text-purple-900 mb-2">대지지분 (Land Share)</div>
                  <p className="text-sm text-gray-700 mb-2">
                    해당 세대가 소유하는 토지의 면적입니다. 넓을수록 재건축 시 분담금이 적고 수익이 높습니다.
                  </p>
                  <div className="text-xs text-gray-600">
                    • 평형이 클수록 대지지분도 큽니다<br/>
                    • 재건축/재개발 시 중요한 지표입니다
                  </div>
                </div>
              </div>
            </div>

            {/* 가격 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Home className="w-5 h-5 mr-2 text-orange-600" />
                가격 정보
              </h3>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>거래가:</strong> 실제 거래된 가격 (단위: 만원)</li>
                  <li><strong>평당가:</strong> 거래가 ÷ 평수 (1평 = 3.3㎡)</li>
                  <li><strong>전용면적:</strong> 실제 사용할 수 있는 공간 (발코니 제외)</li>
                </ul>
              </div>
            </div>

            {/* 필터 사용법 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">필터 사용 팁</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 왼쪽 사이드바에서 매물 유형, 면적, 가격대를 선택할 수 있습니다</li>
                  <li>• 여러 필터를 조합하여 원하는 조건의 매물을 찾을 수 있습니다</li>
                  <li>• "초기화" 버튼으로 모든 필터를 해제할 수 있습니다</li>
                  <li>• 매물 카드의 "상세정보" 배지가 있으면 건축 정보를 확인할 수 있습니다</li>
                </ul>
              </div>
            </div>

            {/* 주의사항 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">주의사항</h3>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 표시된 가격은 실거래가이며, 현재 시세와 다를 수 있습니다</li>
                  <li>• 건축 정보는 대표적인 수치이며, 동/호수별로 차이가 있을 수 있습니다</li>
                  <li>• 투자 결정 시 반드시 전문가와 상담하시기 바랍니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
