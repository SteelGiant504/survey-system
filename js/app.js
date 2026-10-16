document.addEventListener('DOMContentLoaded', async () => {
    const titleEl = document.getElementById('question-title');
    const containerEl = document.getElementById('options-container');
    const messageEl = document.getElementById('message');

    try {
        // 最新の質問を取得
        const { data: questions, error: qError } = await supabase
            .from('questions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

        if (qError) throw qError;

        if (questions.length === 0) {
            titleEl.textContent = '現在アンケートはありません。';
            return;
        }

        const question = questions[0];
        titleEl.textContent = question.title;

        // 質問に紐づく選択肢（画像）を取得
        const { data: options, error: optError } = await supabase
            .from('options')
            .select('*')
            .eq('question_id', question.id);

        if (optError) throw optError;

        // 画像を描画
        options.forEach(option => {
            const div = document.createElement('div');
            div.className = 'image-option';
            
            const img = document.createElement('img');
            img.src = option.image_url;
            img.alt = '選択肢';
            
            div.appendChild(img);
            containerEl.appendChild(div);

            // クリックイベント（回答送信）
            div.addEventListener('click', async () => {
                const { error: resError } = await supabase
                    .from('responses')
                    .insert([{ option_id: option.id }]);

                if (resError) {
                    alert('送信エラー: ' + resError.message);
                } else {
                    containerEl.style.display = 'none';
                    messageEl.textContent = '回答ありがとうございました！';
                    messageEl.style.color = 'green';
                }
            });
        });

    } catch (error) {
        console.error(error);
        titleEl.textContent = 'データの読み込みに失敗しました。';
    }
});

