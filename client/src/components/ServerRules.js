import React, { useState, useEffect } from 'react';

function ServerRules() {
  const [activeSection, setActiveSection] = useState('roleplay');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.rules-section[id]');
      let current = 'roleplay';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const rulesSections = [
    'roleplay', 'in-character', 'out-of-character', 'metagaming', 'powergaming',
    'deathmatching', 'revenge-killing', 'spawn-killing', 'car-ramming', 'car-surfing',
    'random-death-match', 'cop-baiting', 'loot-boxing', 'animation-exploit', 'camp-killer',
    'nonrp-selling', 'character-kill', 'new-life-rule', 'combat-logging', 'not-valuing-life',
    'avoiding-rp', 'anti-zone-blue', 'multi-character', 'hacking-cheat-ddos', 'rp-sex-politics',
    'breaking-character', 'situation-restart', 'criminals-activities', 'xu-ly-vi-pham'
  ];

  // Helper function to get section class with active styling
  const getSectionClass = (sectionId) => {
    return `rules-section ${activeSection === sectionId ? 'border-l-4 border-blue-500 pl-4' : ''}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-80 w-full">
          <div className="sticky top-24">
            <div className="glass-strong rounded-2xl p-6 shadow-glass">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  {/* AWS-style List Icon */}
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-white">Mục lục</h3>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {rulesSections.map((section, index) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      activeSection === section
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-glow'
                        : 'text-gray-300 hover:text-white hover:bg-dark-700/50 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        activeSection === section
                          ? 'bg-white/20'
                          : 'bg-dark-600 group-hover:bg-dark-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="truncate">
                        {section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="glass rounded-2xl shadow-glass overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border-b border-dark-700/50 p-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
                  {/* AWS-style Scale Icon */}
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                    Luật Server
                  </h1>
                  <p className="text-gray-400 mt-1">Quy định chi tiết cho máy chủ roleplay</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">{/* Rules content will continue here */}

              {/* Roleplay Section */}
              <div className={`${getSectionClass('roleplay')} animate-fade-in`} id="roleplay">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">1</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">Roleplay</h3>
                </div>
                <div className="bg-dark-800/30 rounded-xl p-6 border border-dark-700/50">
                  <ul className="space-y-4 text-gray-300 leading-relaxed">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Có thể hiểu là Nhập Vai. Bạn sẽ nhập vai hoàn toàn vào nhân vật trong game bạn mà tạo ra. Bạn phải điều khiển nhân vật trong game thật sự giống ngoài đời. Bạn hãy cố gắng giữ trạng thái nhập vai, không được ngưng tình huống.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Nếu phát hiện người khác sai luật hãy cứ tiếp tục tình huống hoặc cố gắng kết thúc tình huống đó và báo cáo lại.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Nhân vật của bạn phải có cái tên hợp lí, phù hợp với cộng đồng và bối cảnh ở Los Santos. (VD: Daniel Lee, Emily Harris,...)</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Khuyến khích người chơi phát triển nhân vật của mình một cách dần dần, phù hợp với lịch sử và kinh nghiệm của nhân vật.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Không sử dụng những tên vô nghĩa, phi thực tế.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>FailRP có nghĩa là một tình huống roleplay bị thất bại.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Không được phép giải thích quy tắc trong tình huống (Rulesplaining). Hành động này là khi một người dừng tình huống lại để giải thích luật lệ cho người khác khi họ vi phạm, điều này thường làm mất đi sự tự nhiên của tương tác hoặc khiến người chơi không còn tập trung vào nhân vật của họ. Việc này có thể làm giảm đi sự nhập vai và ảnh hưởng đến trải nghiệm chung trong trò chơi.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* In Character Section */}
              <div className={`${getSectionClass('in-character')} animate-fade-in`} id="in-character">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">In Character (IC)</h3>
                </div>
                <div className="bg-dark-800/30 rounded-xl p-6 border border-dark-700/50">
                  <ul className="space-y-4 text-gray-300 leading-relaxed">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Các vấn đề liên quan đến nhập vai.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Out Of Character Section */}
              <div className={`${getSectionClass('out-of-character')} animate-fade-in`} id="out-of-character">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">3</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">Out Of Character (OOC)</h3>
                </div>
                <div className="bg-dark-800/30 rounded-xl p-6 border border-dark-700/50">
                  <ul className="space-y-4 text-gray-300 leading-relaxed">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Người chơi không liên quan đến trò chơi, là nhân vật ngoài đời thực.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* MetaGaming Section */}
              <div className={`${getSectionClass('metagaming')} animate-fade-in`} id="metagaming">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">4</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">MetaGaming (MG)</h3>
                </div>
                <div className="bg-dark-800/30 rounded-xl p-6 border border-dark-700/50">
                  <ul className="space-y-4 text-gray-300 leading-relaxed">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Dùng những thông tin bên ngoài để dành lấy lợi thế cho bản thân. VD: Đá live của người khác, sử dụng discord để lấy thông tin, gặp người đó lần đầu mà đã biết tên?</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>MG được xem làm lấy thông tin trước hoặc chưa diễn ra.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* PowerGaming Section */}
              <div className={`${getSectionClass('powergaming')} animate-fade-in`} id="powergaming">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">5</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">PowerGaming (PG/FailRP)</h3>
                </div>
                <div className="bg-dark-800/30 rounded-xl p-6 border border-dark-700/50">
                  <ul className="space-y-4 text-gray-300 leading-relaxed">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sẽ bao hàm chung giữa Metagaming [MG] + NonRP hành động:</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Powergaming có thể được xem như nhưng hành động không có thật, lạm dụng cách cư xử Roleplay vớ vẩn...</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>PD dùng còng khi tội phạm đang chạy.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sử dụng (Emote) cõng lên xe.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Tấn công ở các tụ điểm công cộng: VD: Bệnh viện, Đồn cảnh sát, City Hall…</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Không sử dụng súng săn bắn PD/Crim/Citizen mà không có bất kì tình huống nào trước đó được xem là PG/RP 1 chiều (bên phía Staff có quyền can thiệp và xử thẳng không cần bằng chứng).</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Deathmatching Section */}
              <div className={`${getSectionClass('deathmatching')} animate-fade-in`} id="deathmatching">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">6</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">Deathmatching (DM)</h3>
                </div>
                <div className="bg-dark-800/30 rounded-xl p-6 border border-dark-700/50">
                  <ul className="space-y-4 text-gray-300 leading-relaxed">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Có thể hiểu là giết người không có RP, tình huống nào trước đó.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Revenge Killing Section */}
              <div className={`${getSectionClass('revenge-killing')} animate-fade-in`} id="revenge-killing">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">7</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">Revenge Killing (RK)</h3>
                </div>
                <div className="bg-dark-800/30 rounded-xl p-6 border border-dark-700/50">
                  <ul className="space-y-4 text-gray-300 leading-relaxed">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Trả thù phi thực tế:</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Khi bạn bị tấn công bởi ai đó và bất tỉnh được đưa về bệnh viện, không có bất kỳ ai làm chứng hay chứng kiến vụ việc đó coi như tình huống đó kết thúc.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Bạn không được phép quay lại gặp người đó trả thù.</span>
                    </li>
                  </ul>
                </div>
              </div>

      {/* Spawn Killing Section */}
      <div className="rules-section" id="spawn-killing">
        <h3>Spawn Killing (SK)</h3>
        <ul className="rules-list">
          <li>Không được đợi người khác vừa vào game hay từ bệnh viện ra để giết tiếp: Điều này được bao gồm PG + RP 1 chiều.</li>
        </ul>
      </div>

      {/* Car Ramming Section */}
      <div className="rules-section" id="car-ramming">
        <h3>Car Ramming (CR) / Car Parking (CP)</h3>
        <ul className="rules-list">
          <li>Dùng phương tiện tấn công người khác không có lý do, đậu xe lên đối tượng kéo máu cho đến chết, ngoài ra nếu bạn dùng phương tiện tông xe người khác liên tục hoặc chạy loạn xì ngầu ở khu vực có người qua lại, bạn cũng sẽ gián tội NonRP lái xe.</li>
          <li>PD sử dụng xe để Tông tội phạm sẽ được xem là (CR).</li>
        </ul>
      </div>

      {/* Car Surfing Section */}
      <div className="rules-section" id="car-surfing">
        <h3>Car Surfing (CS)</h3>
        <ul className="rules-list">
          <li>Người chơi nên sử dụng phương tiện một cách thực tế phù hợp với nhân vật và tình huống.</li>
          <li>Dùng phương tiện để bay nhảy lên các tòa nhà cao hay nhảy lên nóc.</li>
          <li>Lái xe 4 bánh trên đường và bay từ 1 cây cầu cao tốc cao xuống dưới đất và tiếp tục chạy như thể xe không bị gì, điều này bị cấm.</li>
          <li>Lái xe 2 bánh (moto...) trên đường và bay lên cao và tiếp đất hoặc bốc đầu để bay qua các vật thể điều này bị cấm.</li>
          <li>vd: Chạy 120mph bay từ cao tốc bay xuống đường</li>
        </ul>
      </div>

      {/* Random Death Match Section */}
      <div className="rules-section" id="random-death-match">
        <h3>Random Death Match (RDM)</h3>
        <ul className="rules-list">
          <li>Hành động gây hại hoặc giết chết nhân vật khác mà không có bất kỳ sự chuẩn bị hoặc tương tác roleplay trước đó.</li>
          <li>Không có lý do rõ ràng hoặc logic trong tình huống cho hành động, làm cho hành động trở nên ngẫu nhiên và không thực tế.</li>
        </ul>
      </div>

      {/* Cop Baiting Section */}
      <div className="rules-section" id="cop-baiting">
        <h3>Cop Baiting (CB)</h3>
        <ul className="rules-list">
          <li>Dùng phương tiện chặn đầu xe Cảnh sát, troll Cops đại loại những hành động lấn át hay theo dõi Cop, vì đây là vấn đề ngoài đời không ai to gan dám làm, bạn lạm dụng sức mạnh game để mưu đồ khoái trí cá nhân một cách sai lý thuyết cuộc sống.</li>
          <li>Khi thoát được cảnh sát bạn sẽ bắt đầu rơi vào tính huống trốn thoát chứ không phải quay lại để trêu cảnh sát non, gà, blabla…</li>
          <li>Cố gắng để thu hút sự chú ý của cảnh sát mà không có lý do chính đáng.</li>
          <li>Đang di chuyển trên một phương tiện nào đó, bất ngờ chạy ngang khu vực có cảnh sát tuần tra làm việc, chửi liên tục về phía cảnh sát.</li>
          <li>Chạy vòng quanh đồn không có mục đích nào.</li>
        </ul>
      </div>

      {/* Loot Boxing Section */}
      <div className="rules-section" id="loot-boxing">
        <h3>Loot Boxing (LB)</h3>
        <ul className="rules-list">
          <li>Việc cướp người khác phải có tình huống RP trước đó.</li>
          <li>Việc giao tranh băng đảng là triệt hạ lẫn nhau chứ không phải để loot.</li>
          <li>Bắn PD/ hạ gục PD là để bỏ trốn không được setup bắn PD để loot đồ.</li>
        </ul>
      </div>

      {/* Animation Exploit Section */}
      <div className="rules-section" id="animation-exploit">
        <h3>Animation Exploit (AE)</h3>
        <ul className="rules-list">
          <li>Dùng lệnh hành động để trốn tránh.</li>
          <li>Né đạn.</li>
          <li>Nghiêm cấm sử dụng Hành động (Emote) có lợi cho bản thân khi đang trong tình huống như: Giao tranh, Chạy cảnh sát...</li>
          <li>Nghiêm cấm sử dụng Hành động (Emote) để lợi dụng BUG chuộc lợi cho bản thân.</li>
          <li>Nghiêm cấm sử dụng Hành động chung (Emote) quấy phá và gây ảnh hưởng đến quá trình RP của người khác.</li>
        </ul>
      </div>

      {/* Camp Killer Section */}
      <div className="rules-section" id="camp-killer">
        <h3>Camp Killer (CK)</h3>
        <ul className="rules-list">
          <li>Không cho phép người khác hồi sinh hoặc bác sĩ cứu.</li>
          <li>Giấu xác người chơi khác.</li>
        </ul>
      </div>

      {/* NonRP Selling Section */}
      <div className="rules-section" id="nonrp-selling">
        <h3>NonRP Selling (NS)</h3>
        <ul className="rules-list">
          <li>Bạn sẽ không được buôn bán các mặt hàng bẩn trên các trang mạng xã hội.</li>
          <li>Việc buôn bán các mặt hàng không được diễn ra ở các khu vực công cộng.</li>
        </ul>
      </div>

      {/* Character Kill Section */}
      <div className="rules-section" id="character-kill">
        <h3>Character Kill (CK)</h3>
        <ul className="rules-list">
          <li>Khai tử nhân vật nếu muốn người chơi khai tử nhân vật một cách Roleplay. (Tự tử hay bị ám sát). Điều này chỉ có thể thực hiện khi người chơi chấp nhận khai tử và báo cáo lên Staff.</li>
        </ul>
      </div>

      {/* New Life Rule Section */}
      <div className="rules-section" id="new-life-rule">
        <h3>New Life Rule (NLR)</h3>
        <ul className="rules-list">
          <li>Nếu được cứu từ cảnh sát, bác sĩ, bạn sẽ không mất trí nhớ hoàn toàn (tùy cách bạn RP).</li>
          <li>Bạn cố gắng liên hệ cho EMS để về viện không được Local về.</li>
        </ul>
      </div>

      {/* Combat Logging Section */}
      <div className="rules-section" id="combat-logging">
        <h3>Combat Logging - Out game Tránh Tương Tác</h3>
        <ul className="rules-list">
          <li>Cố ý thoát game để tránh các tình huống Roleplay.</li>
          <li>Thoát game khi không phải do lỗi kỹ thuật nhằm mục đích trốn thoát 1 tình huống nào đó. (nếu bị lỗi dẫn tới crash thì hãy báo lên room discord ).</li>
        </ul>
      </div>

      {/* Not Valuing Life Section */}
      <div className="rules-section" id="not-valuing-life">
        <h3>Not Valuing Life (NVL)</h3>
        <ul className="rules-list">
          <li>Phải biết tôn trọng mạng sống (làm gì cũng phải đặt tính mạng lên hàng đầu).</li>
          <li>Tên gọi khác là FearRP. Bạn phải biết sợ hãi, bảo vệ cho tính mạng nhân vật của mình. Ví dụ: người khác chĩa súng vào đầu bạn phải tỏ ra sợ hãi và làm theo.</li>
          <li>2 băng đảng đang giao tranh không được viện cớ là hóng chuyện để đứng xem.</li>
          <li>Không được phép diễn ra các cuộc chiến tại những chính phủ: Đồn cảnh sát, Bệnh viện, City Hall, những toà nhà chính phủ....</li>
        </ul>
      </div>

      {/* Avoiding RP Section */}
      <div className="rules-section" id="avoiding-rp">
        <h3>Avoiding RP</h3>
        <ul className="rules-list">
          <li>AFK/Quit game để trốn tránh tình huống.</li>
          <li>Đi vào các địa điểm spawn để trốn tình huống.</li>
          <li>Không được gọi EMS khi vẫn còn tình huống. VD: đang giao tranh bạn gọi EMS lên cứu.</li>
        </ul>
      </div>

      {/* Anti Zone Blue Section */}
      <div className="rules-section" id="anti-zone-blue">
        <h3>Anti Zone Blue</h3>
        <ul className="rules-list">
          <li>Là khu vực cấm thực hiện các hành vi phạm tội (giết người, bắt cóc, cướp, đánh đập…).</li>
          <li>Thực hiện hành vi phạm tội (giết người, bắt cóc, cướp, đánh đập…) trong đồn cảnh sát LSPD, hoặc các tòa nhà chính phủ sẽ được coi là khủng bố và tình huống đó sẽ lập tức chuyển sang tình huống CK (Character Kill) mà không cần sự cho phép của hai bên. Nó sẽ kết thúc cho đến khi nhân viên chính phủ bắt được hoặc giết chết (nhóm) tội phạm đó.</li>
          <li>Không được bắt cóc tại các khu vực công cộng:</li>
          <li>Chung cư.</li>
          <li>Bệnh viện.</li>
          <li>Đồn Cảnh sát.</li>
          <li>City Hall.</li>
          <li>Các doanh nghiệp lớn.</li>
          <li>Không được xảy ra các cuộc ẩu đả ở những nơi công cộng.</li>
        </ul>
      </div>

      {/* Multi Character Section */}
      <div className="rules-section" id="multi-character">
        <h3>Multi Character</h3>
        <ul className="rules-list">
          <li>Không được tạo nhiều nhân vật chơi cùng 1 gang/tổ chức.</li>
          <li>Trong vòng 24h chỉ được phép chơi 1 nhân vật.</li>
          <li>Nghĩa là trong vòng 24h nếu bạn xác định chơi nhân vật nào thì phải chơi nhân vật đó đến hết ngày. Tránh tình trạng đang chơi nhân vật này nhảy qua nhân vật khác.</li>
          <li>Nếu chơi nhiều nhân vật hãy cố gắng nhập vai trong một cuộc sống khác.</li>
        </ul>
      </div>

      {/* Hacking/Cheat/DDOS Section */}
      <div className="rules-section" id="hacking-cheat-ddos">
        <h3>Hacking/Cheat/DDOS</h3>
        <ul className="rules-list">
          <li>Lạm dụng lỗi server để chuộc lợi mà không báo cáo cho admin.</li>
          <li>Việc sử dụng phần mềm thứ 3 sẽ dẫn đến Ban vĩnh viễn.</li>
          <li>Ban vĩnh viễn... không nói nhiều.</li>
        </ul>
      </div>

      {/* RP Sex, Politics Section */}
      <div className="rules-section" id="rp-sex-politics">
        <h3>Rp Sex, Chính Trị, Bôi Nhọ, ERP Kids</h3>
        <ul className="rules-list">
          <li>Nghiêm cấm các hành vi RP về chính trị, bôi nhọ, làm nhục đối với cấp độ cá nhân hoặc nhóm cá nhân.</li>
          <li>Các hành vi RP liên quan tới vấn đề tình dục/quấy rối bôi nhọ đều bị cấm.</li>
          <li>Không được lấy lý do tính cánh nhân vật để phản biện...</li>
          <li>Nhập vai trẻ em cũng bị cấm tuyệt đối.</li>
        </ul>
      </div>

      {/* Breaking Character Section */}
      <div className="rules-section" id="breaking-character">
        <h3>Breaking Character (yêu cầu xóa nhân vật)</h3>
        <ul className="rules-list">
          <li>Điều này chỉ được diễn ra khi 2 bên đều chấp nhận.</li>
          <li>Việc deal trước là nên cần thiết khi muốn lấy bộ phận: (tay, chân).</li>
        </ul>
      </div>

      {/* Situation Restart Section */}
      <div className="rules-section" id="situation-restart">
        <h3>Situation Restart</h3>
        <ul className="rules-list">
          <li>Không được thực hiện các vụ cướp trước 30p restart.</li>
          <li>Không xảy ra tình huống PD trong 1 tiếng trước restart.</li>
          <li>Mặc dù restart nhưng vẫn phải giữ trạng thái nhập vai.</li>
        </ul>
      </div>

      {/* Criminals Activities Section */}
      <div className="rules-section" id="criminals-activities">
        <h3>Criminals Activities (Hoạt động tội phạm)</h3>
        <ul className="rules-list">
          <li>[P]: Những việc liên quan đến hoạt động hằng ngày không cần con tin (thu bảo kê, cướp cần, rửa tiền, rã xe, AC…).</li>
          <li>[B]: Những vụ cướp bắt buộc phải luôn có con tin. (fleeca, ATM…).</li>
          <li>2-4 người cho 1 vụ AC (tính cả backup).</li>
          <li>4-6 người + 1 con tin (tính cả beckup) cho 1 vụ fleeca, ATM. áp chế bắt buộc phải có vũ khí (không tính súng săn).</li>
          <li>4-6 người crim rã xe, thu bảo kê.</li>
          <li>Cướp hoặc bắt cóc bắt buộc từ 3-6 người và phải có vũ khí trấn áp (không áp dụng đối với súng săn hoặc vũ khí không gây sát thương).</li>
          <li>Không được cướp trong thời gian bảo trì trước và sau 30p.</li>
          <li>Không được cướp liên tục. (nghĩa là không thực hiện vụ cướp trong thời gian ngắn tầm khoảng thời gian 15p-30p vì PD vẫn có quyền khả nghi và kiểm tra bạn, hãy bảo đảm an toàn cho bạn).</li>
          <li>PD có quyền nhận dạng bạn qua mặt nạ màu xe bạn xảy ra vụ cướp (nên thay quần áo, thay đổi phương tiện).</li>
          <li>Luôn chấn áp con tin (nếu không PD có quyền sử dụng vũ lực để chấn áp).</li>
          <li>Không truy đuổi PD đã rút lui để truy đuổi và triệt hạ. Phải rời khỏi hiện trường nếu cảm thấy an toàn.</li>
          <li>Cướp người chơi khác mà không có lý do RP được xem là Loot Boxing.</li>
          <li>Cướp được xem là tình huống RP không phải là nghề nghiệp việc hay farm.</li>
          <li>Việc chạy theo hay đứng tại nơi đông người kêu: (ê cướp đây, bọn tao là cướp) việc này được xem là không có tình huống RP.</li>
          <li>Sử dụng thông tin từ bên ngoài như ( Discord, Streamer vv…) để lấy lợi thế là không hay.</li>
          <li>Sử dụng bất cứ thông tin từ bên ngoài ( cứu tao, tới rước tao, tao ở đây! vv…) nếu thấy xử lý theo luật.</li>
          <li>Nếu không liên quan đến tình huống rời khỏi khu vực hiện trường, không chấp nhận việc (hóng, đến xem, hay đứng lại xem vv…).</li>
          <li>Khi diễn ra 1 vụ cướp mà bên kia đã tới khu vực và bắt đầu trộm, bên kia đến sau và muốn cướp chỗ này (việc này được xem là không hay và mất đi sự tự nhiên).</li>
          <li>Một crim có 6 người và một người bị ngất hay có bất cứ việc gì bạn gọi thêm người thứ 7, mà vụ cướp đang diễn ra điều này không được phép.</li>
          <li>Bạn đã là crim phải luôn giữ cho mình trạng thái sợ hãi và chống đối lại PD. (không khiêu khích, hay trêu ghẹo PD non, gà, đố bắt được em……..).</li>
          <li>Có mâu thuẫn Crim với nhau giải quyết bằng Crim không lôi bất cứ băng đảng nào vào trong cuộc chiến đó.</li>
          <li>Các khu vực trọng điểm có nhiều cư dân qua lại như: Chung cư, bệnh viện, đồn cảnh sát, City Hall, các khu vực làm nghề sạch không được thực hiện các vụ giết nhau không vì lý do RP cá nhân.</li>
          <li>Không thực hiện tìm các con tin tại những địa điểm nghề sạch hoặc khu vực công cộng.</li>
          <li>Việc đưa thông tin cho nhau rất quan trọng, hãy đưa thông tin cho bên kia để người ta còn biết lý do. vd: cho mày 2p chuẩn bị....</li>
          <li>Lập 1 nhóm Crim phải quen biết nhau từ trước. (ít nhất khoảng 3-5 ngày trở lên)</li>
          <li>Không xảy ra các vụ giết nhau trong 30p động đất / máy chủ reset quy vô RDM. Nếu bạn có xảy ra vụ việc trước 30p điều này được phép.</li>
          <li>Việc các bạn làm do các bạn quyết định. Admin sẽ theo dõi quá trình các bạn nhập vai</li>
          <li>Không chấp nhận việc gọi người ngoài gọi đồ tiếp tế nếu vụ cướp đang diễn ra.</li>
          <li>Nếu bạn đang trong tình huống cướp/ giao tranh và ra khỏi khu vực hiện trường, coi như out tình huống nếu quay lại và vớt/ cướp sẽ xử lý vi phạm.</li>
        </ul>
      </div>

      {/* Punishment Section */}
      <div className="rules-section" id="xu-ly-vi-pham">
        <h3>Xử lý vi phạm (tuỳ từng mức độ)</h3>
        <ul className="rules-list">
          <li>Tùy vào vi phạm và số lần vi phạm bên phía Staff sẽ có các hình thức xử lý như dưới:</li>
          <li>Tất cả các bài tố cáo sẽ không được public ra ngoài nếu sợ mất lòng thì đừng lo.</li>
          <li>Vi phạm sẽ nhận về Warning cho bản thân nếu phạm đủ 20 Warning BAN vĩnh viễn.</li>
          <li>Nếu bên phía Staff phát hiện người chơi vi phạm hình phạt sẽ không giảm.</li>
        </ul>
      </div>

              {/* Notice Section */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6 mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm">⚠️</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-amber-400">Lưu ý quan trọng</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>Quy định có thể được cập nhật bất kỳ lúc nào. Người chơi có trách nhiệm kiểm tra và cập nhật các quy định mới.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>Ban quản trị có quyền đưa ra quyết định cuối cùng trong mọi tình huống không được đề cập trong quy định.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>Việc tham gia máy chủ đồng nghĩa với việc bạn đã đọc và đồng ý tuân thủ tất cả các quy định trên.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerRules;