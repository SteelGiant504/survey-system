// js/admin.js
document.getElementById('admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    const statusDiv = document.getElementById('status');
    submitBtn.disabled = true;
    statusDiv.textContent = '処理中...';

    const questionTitle = document.getElementById('question').value;
    const fileInput = document.getElementById('images');
    const files = fileInput.files;

    if (files.length === 0) {
        statusDiv.textContent = '画像を選択してください。';
        submitBtn.disabled = false;
        return;
    }

    try {
        // 1. 質問を questions テーブルに登録
        const { data: questionData, error: qError } = await supabaseClient
            .from('questions')
            .insert([{ title: questionTitle }])
            .select()
            .single();

        if (qError) throw qError;
        const questionId = questionData.id;

        // 2. 画像のアップロードと options テーブルへの登録
        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${questionId}/${fileName}`;

            // ストレージにアップロード
            const { error: uploadError } = await supabaseClient.storage
                .from('survey-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 公開URLを取得
            const { data: publicUrlData } = supabaseClient.storage
                .from('survey-images')
                .getPublicUrl(filePath);

            // optionsテーブルに登録
            const { error: optError } = await supabaseClient
                .from('options')
                .insert([{
                    question_id: questionId,
                    image_url: publicUrlData.publicUrl
                }]);

            if (optError) throw optError;
        }

        statusDiv.textContent = 'アンケートの作成が完了しました！';
        statusDiv.style.color = 'green';
        document.getElementById('admin-form').reset();

    } catch (error) {
        console.error(error);
        statusDiv.textContent = 'エラーが発生しました: ' + error.message;
        statusDiv.style.color = 'red';
    } finally {
        submitBtn.disabled = false;
    }
});

